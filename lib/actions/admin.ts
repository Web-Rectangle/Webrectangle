'use server';

import { randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSession, destroySession, isAdmin, verifyPassword } from '@/lib/auth/admin';
import { getRepositories } from '@/lib/repositories';
import { creatorSchema } from '@/lib/schemas/creator';
import { submissionStatusSchema } from '@/lib/schemas/lead';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Admin Server Actions.
 *
 * Every mutating action re-checks `isAdmin()` rather than trusting that the
 * page rendered the form. Server Actions are addressable endpoints - anyone
 * who has seen the page can replay one - so a guard on the page alone would
 * not be a guard at all.
 */

export type AdminFormState = { status: 'idle' | 'error'; message?: string };

/**
 * Turn the creator profile form into a validated Creator.
 *
 * Shared by `publishCreator` (from a submission) and `saveCreator` (created
 * directly), so the two entry points cannot validate differently or drift as
 * fields are added.
 *
 * `origin` is always 'admin' here: anything coming through this form is a real
 * creator, never one of the illustrative seed samples.
 */
function parseCreatorForm(formData: FormData, { id }: { id: string }) {
  const numeric = (key: string) => Number(formData.get(key));
  const list = (key: string) =>
    String(formData.get(key) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  return creatorSchema.safeParse({
    id,
    origin: 'admin',
    handle: String(formData.get('handle') ?? '').replace(/^@/, ''),
    displayName: formData.get('displayName'),
    platform: formData.get('platform'),
    category: formData.get('category'),
    niche: formData.get('niche'),
    city: formData.get('city'),
    region: formData.get('region'),
    languages: list('languages'),
    followers: numeric('followers'),
    engagementRate: numeric('engagementRate'),
    avgViews: numeric('avgViews'),
    contentTypes: formData.getAll('contentTypes'),
    audience: {
      primaryAgeBand: formData.get('primaryAgeBand'),
      primaryAgeShare: numeric('primaryAgeShare'),
      femaleShare: numeric('femaleShare'),
      topLocations: list('topLocations'),
    },
    pastCollaborations: numeric('pastCollaborations'),
    bio: formData.get('bio'),
    tier: formData.get('tier'),
  });
}

async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/login?next=/admin');
}

export async function adminLogin(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  // Rate limited hard: one shared password is exactly the thing worth
  // brute-forcing, and there is no account to lock instead.
  const ip = clientIpFrom(await headers());
  const { allowed, retryAfter } = rateLimit(`admin-login:${ip}`, 5, 5 * 60_000);

  if (!allowed) {
    return { status: 'error', message: `Too many attempts. Try again in ${retryAfter} seconds.` };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || !verifyPassword(password)) {
    // Deliberately vague: confirming whether a password merely "exists" would
    // tell an attacker whether the panel is configured.
    return { status: 'error', message: 'Incorrect password.' };
  }

  await createSession();
  redirect('/admin');
}

export async function adminLogout(): Promise<void> {
  await destroySession();
  redirect('/login');
}

/** Approve or decline a submission. */
export async function reviewSubmission(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = formData.get('id');
  const parsedStatus = submissionStatusSchema.safeParse(formData.get('status'));

  if (typeof id !== 'string' || !parsedStatus.success) return;

  const repos = await getRepositories();
  const lead = await repos.leads.setStatus(id, parsedStatus.data);

  revalidatePath('/admin');

  // Approving a creator is only half the job - they are not discoverable
  // until a profile exists, so go straight to the form that creates one.
  if (lead && parsedStatus.data === 'approved' && lead.audience === 'creator') {
    redirect(`/admin/submissions/${id}/publish`);
  }
}

/**
 * Publish an approved creator submission as a live profile.
 *
 * This is the step that actually puts someone into discovery, which is why it
 * is separate from approval: approving says "we want to work with them",
 * publishing says "their profile is complete enough to show a brand".
 */
export async function publishCreator(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await assertAdmin();

  const submissionId = formData.get('submissionId');
  if (typeof submissionId !== 'string') {
    return { status: 'error', message: 'Missing submission reference.' };
  }

  const repos = await getRepositories();
  const submission = await repos.leads.findById(submissionId);

  if (!submission) return { status: 'error', message: 'That submission no longer exists.' };

  const parsed = parseCreatorForm(formData, {
    // Reuse the profile id on re-publish so editing updates rather than
    // duplicating the creator.
    id: submission.publishedCreatorId ?? `cr-${submissionId.slice(0, 8)}`,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      status: 'error',
      message: first ? `${first.path.join('.')}: ${first.message}` : 'Please check the fields.',
    };
  }

  await repos.creators.upsert(parsed.data);
  await repos.leads.linkPublishedCreator(submissionId, parsed.data.id);

  revalidateAdmin();
  redirect('/admin?published=1');
}

/** Every surface that reflects submission or listing state. */
function revalidateAdmin(): void {
  revalidatePath('/admin');
  revalidatePath('/admin/creators');
  revalidatePath('/discover');
  revalidatePath('/');
}

/** Private annotation on a submission, saved from the detail page. */
export async function saveAdminNote(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = formData.get('id');
  const note = formData.get('note');
  if (typeof id !== 'string' || typeof note !== 'string') return;

  const repos = await getRepositories();
  await repos.leads.setNote(id, note);

  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath('/admin');
}

/**
 * Approve or decline several submissions at once.
 *
 * Unlike the single-row action this never redirects to the publish form -
 * bulk-approving ten creators should not fling the admin into the first one's
 * profile editor. They are approved, and the queue shows which still need
 * details adding.
 */
export async function bulkReview(formData: FormData): Promise<void> {
  await assertAdmin();

  const ids = formData.getAll('ids').filter((v): v is string => typeof v === 'string');
  const parsedStatus = submissionStatusSchema.safeParse(formData.get('status'));
  if (ids.length === 0 || !parsedStatus.success) return;

  const repos = await getRepositories();
  await Promise.all(ids.map((id) => repos.leads.setStatus(id, parsedStatus.data)));

  revalidateAdmin();
}

/* ---------------------------------------------------------------------- */
/* Creator listing control                                                 */
/* ---------------------------------------------------------------------- */

/**
 * Remove a creator from public discovery without deleting them.
 *
 * The reversible counterpart to `deleteCreator`, and the one an admin should
 * reach for by default - a creator between campaigns is hidden, not gone.
 */
export async function setCreatorHidden(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = formData.get('id');
  if (typeof id !== 'string') return;

  const repos = await getRepositories();
  await repos.creators.setHidden(id, formData.get('hidden') === 'true');

  revalidateAdmin();
}

/** Pin a creator to the front of the listing. */
export async function setCreatorFeatured(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = formData.get('id');
  if (typeof id !== 'string') return;

  const repos = await getRepositories();
  await repos.creators.setFeatured(id, formData.get('featured') === 'true');

  revalidateAdmin();
}

/**
 * Delete a creator outright.
 *
 * Irreversible for admin-created profiles, so the UI puts it behind a
 * confirmation and offers hiding as the softer option.
 */
export async function deleteCreator(formData: FormData): Promise<void> {
  await assertAdmin();

  const id = formData.get('id');
  if (typeof id !== 'string') return;

  const repos = await getRepositories();
  await repos.creators.remove(id);

  revalidateAdmin();
}

/**
 * Create or edit a creator directly, with no submission behind it.
 *
 * Needed because not every creator arrives through the website - some are
 * people the team already works with, and making an admin fake a form
 * submission to list them would be absurd.
 */
export async function saveCreator(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await assertAdmin();

  const parsed = parseCreatorForm(formData, {
    id: String(formData.get('creatorId') ?? '') || `cr-${randomUUID().slice(0, 8)}`,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      status: 'error',
      message: first ? `${first.path.join('.')}: ${first.message}` : 'Please check the fields.',
    };
  }

  const repos = await getRepositories();
  await repos.creators.upsert(parsed.data);

  revalidateAdmin();
  redirect('/admin/creators?saved=1');
}
