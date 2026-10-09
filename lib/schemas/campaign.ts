import { z } from 'zod';

/**
 * Campaign, invitation and deliverable schemas.
 *
 * These model the collaboration lifecycle described in the brand brief. The
 * public marketing site only *illustrates* this workflow today (the "Invite to
 * Collaborate" section renders the invitation card and its three responses),
 * but the shapes are defined here and mirrored in prisma/schema.prisma so the
 * product can be built against them without a redesign.
 */

/** What a brand is trying to achieve. Open-ended by design; see brief section 13. */
export const CAMPAIGN_OBJECTIVES = [
  'awareness',
  'engagement',
  'product-launch',
  'sales',
  'traffic',
  'ugc',
] as const;
export const campaignObjectiveSchema = z.enum(CAMPAIGN_OBJECTIVES);

/**
 * Campaign lifecycle. Ordered, and the order is meaningful - the UI renders
 * progress by index, so new states must be inserted at the right position
 * rather than appended.
 */
export const CAMPAIGN_STATUSES = [
  'draft',
  'invited',
  'accepted',
  'negotiation',
  'active',
  'in-progress',
  'submitted',
  'review',
  'revision',
  'approved',
  'published',
  'completed',
] as const;
export const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;

/** A creator's three possible responses to a collaboration invitation. */
export const INVITATION_STATUSES = ['sent', 'accepted', 'rejected', 'changes-requested'] as const;
export const invitationStatusSchema = z.enum(INVITATION_STATUSES);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

export const DELIVERABLE_KINDS = ['reel', 'post', 'story', 'video', 'short'] as const;
export const deliverableKindSchema = z.enum(DELIVERABLE_KINDS);

export const deliverableSchema = z.object({
  id: z.string().min(1),
  kind: deliverableKindSchema,
  quantity: z.number().int().positive(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

export const campaignSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  brandId: z.string().min(1),
  objective: campaignObjectiveSchema,
  status: campaignStatusSchema,
  productOrService: z.string().optional(),
  targetAudience: z.string().optional(),
  locations: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  /** Stored in paise to avoid floating-point drift on currency. */
  budgetMinor: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('INR'),
  deliverables: z.array(deliverableSchema).default([]),
  usageRights: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type Campaign = z.infer<typeof campaignSchema>;
export type Deliverable = z.infer<typeof deliverableSchema>;

export const invitationSchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  creatorId: z.string().min(1),
  status: invitationStatusSchema,
  message: z.string().optional(),
  respondedAt: z.string().optional(),
  createdAt: z.string(),
});

export type Invitation = z.infer<typeof invitationSchema>;

/** Human-readable labels, kept beside the enum so they cannot fall out of sync. */
export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: 'Draft',
  invited: 'Invitation sent',
  accepted: 'Accepted',
  negotiation: 'Negotiation',
  active: 'Active',
  'in-progress': 'Content in progress',
  submitted: 'Submitted',
  review: 'In review',
  revision: 'Revision',
  approved: 'Approved',
  published: 'Published',
  completed: 'Completed',
};

export const createCampaignSchema = z.object({
  name: z.string().trim().min(2, 'Campaign name required').max(120),
  brandId: z.string().trim().min(1, 'Brand ID required'),
  objective: campaignObjectiveSchema,
  status: campaignStatusSchema.default('draft'),
  productOrService: z.string().trim().max(160).optional(),
  targetAudience: z.string().trim().max(160).optional(),
  locations: z.array(z.string().trim()).default([]),
  platforms: z.array(z.string().trim()).default([]),
  budgetMinor: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('INR'),
  deliverables: z
    .array(
      deliverableSchema.omit({ id: true }).extend({
        id: z.string().optional(),
      }),
    )
    .default([]),
  usageRights: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const createInvitationSchema = z.object({
  creatorId: z.string().min(1, 'Creator ID required'),
  message: z.string().trim().max(2000).optional(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const respondInvitationSchema = z.object({
  status: invitationStatusSchema.refine((s) => s !== 'sent', {
    message: 'Response status must be accepted, rejected, or changes-requested',
  }),
  message: z.string().trim().max(2000).optional(),
});

export type RespondInvitationInput = z.infer<typeof respondInvitationSchema>;
