import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublishCreatorForm } from '@/components/admin/publish-creator-form';
import { Card } from '@/components/ui/card';
import { getRepositories } from '@/lib/repositories';

/** Best-effort handle from an email, as a starting point the admin can edit. */
function suggestHandle(email: string, name: string): string {
  const local = email.split('@')[0] ?? '';
  const cleaned = local.replace(/[^a-z0-9._]/gi, '').toLowerCase();
  if (cleaned.length >= 3) return cleaned;
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Fill in an approved creator's profile and publish it.
 *
 * Reached automatically after approving a creator, and again from the queue
 * via "Edit listing". Re-publishing reuses the same profile id, so editing
 * updates the existing listing instead of creating a duplicate.
 */
export default async function PublishSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repos = await getRepositories();
  const submission = await repos.leads.findById(id);

  if (!submission) notFound();

  const existing = submission.publishedCreatorId
    ? await repos.creators.findById(submission.publishedCreatorId)
    : null;

  return (
    <main className="container-wr py-10">
      <Link
        href="/admin"
        className="text-muted hover:text-accent mb-7 inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to submissions
      </Link>

      <div className="mb-7">
        <h1 className="mb-1.5 text-[clamp(26px,3vw,34px)]">
          {existing ? 'Edit listing' : 'Add creator details'}
        </h1>
        <p className="max-w-2xl text-[15px]">
          {existing
            ? 'Update the profile shown to brands in creator discovery.'
            : 'A signup gives us a name and an email, which is not enough for a brand to judge fit. Fill in what they actually filter on, then publish.'}
        </p>
      </div>

      {/* What the creator actually sent, kept visible while filling the form
          so the admin does not have to hold it in their head or tab back. */}
      <Card className="mb-8 p-5">
        <p className="text-muted mb-2 text-[11px] font-bold tracking-[0.1em] uppercase">
          Their submission
        </p>
        <p className="text-ink text-[15px] font-bold">{submission.name}</p>
        <p className="text-muted mb-3 text-[13px]">
          {submission.email}
          {submission.company ? ` · ${submission.company}` : ''}
          {submission.phone ? ` · ${submission.phone}` : ''}
        </p>
        <p className="text-[14px] whitespace-pre-line">{submission.message}</p>
      </Card>

      <PublishCreatorForm
        submissionId={submission.id}
        defaults={{
          displayName: submission.name,
          handle: suggestHandle(submission.email, submission.name),
        }}
        existing={existing}
      />
    </main>
  );
}
