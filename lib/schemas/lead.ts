import { z } from 'zod';

/**
 * Lead and waitlist schemas.
 *
 * Shared verbatim between the client form and the Server Action, so validation
 * messages a user sees during typing are the same rules enforced on the server.
 */

export const AUDIENCES = ['brand', 'creator', 'other'] as const;
export const audienceTypeSchema = z.enum(AUDIENCES);
export type AudienceType = z.infer<typeof audienceTypeSchema>;

/** Where a submission came from, for routing and later attribution. */
export const LEAD_SOURCES = [
  'contact',
  'brand-waitlist',
  'creator-waitlist',
  'discover-early-access',
  'pricing',
] as const;
export const leadSourceSchema = z.enum(LEAD_SOURCES);
export type LeadSource = z.infer<typeof leadSourceSchema>;

/**
 * Anti-spam fields, submitted by every form via <SpamGuard />.
 *
 * `companyWebsite` is a decoy that must stay empty. `renderedAt` is the epoch
 * millisecond timestamp of when the form hydrated; anything submitted within
 * MIN_FILL_MS is treated as automated. A missing or unparseable timestamp is
 * tolerated rather than rejected, because a legitimate user with JavaScript
 * disabled will not have one.
 */
export const MIN_FILL_MS = 2_500;

export const spamGuardSchema = z.object({
  companyWebsite: z.string().max(0, 'Rejected.').optional().or(z.literal('')),
  renderedAt: z.string().optional(),
});

/** Returns true when the submission looks automated. */
export function looksAutomated(input: {
  companyWebsite?: string | null;
  renderedAt?: string | null;
}): boolean {
  if (input.companyWebsite) return true;

  if (input.renderedAt) {
    const started = Number(input.renderedAt);
    if (Number.isFinite(started) && Date.now() - started < MIN_FILL_MS) return true;
  }

  return false;
}

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.email('Enter a valid email address.'),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+0-9 ()-]*$/, 'Use digits, spaces and + ( ) - only.')
    .optional()
    .or(z.literal('')),
  audience: audienceTypeSchema.default('brand'),
  message: z.string().trim().min(10, 'Tell us a little more - at least 10 characters.').max(4000),
  source: leadSourceSchema.default('contact'),
});

export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Review state of a submission.
 *
 * Every enquiry lands as `pending`. The admin panel moves creators to
 * `approved` (which unlocks the profile form that publishes them into
 * discovery) or `declined`. Brand enquiries use the same states so one queue
 * covers both audiences.
 */
export const SUBMISSION_STATUSES = ['pending', 'approved', 'declined'] as const;
export const submissionStatusSchema = z.enum(SUBMISSION_STATUSES);
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

export type Lead = LeadInput & {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  reviewedAt?: string;
  /** Set once an approved creator submission has been published as a profile. */
  publishedCreatorId?: string;
  /** Private to the admin panel. Never shown to the person who submitted. */
  adminNote?: string;
};

/** Short-form capture used by the early-access and waitlist CTAs. */
export const waitlistSchema = z.object({
  email: z.email('Enter a valid email address.'),
  name: z.string().trim().max(120).optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  audience: audienceTypeSchema,
  source: leadSourceSchema.default('discover-early-access'),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export type WaitlistEntry = WaitlistInput & {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  reviewedAt?: string;
};
