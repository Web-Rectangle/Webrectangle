import { z } from 'zod';

import { categorySchema, contentTypeSchema, platformSchema } from './creator';

/**
 * Creator application / onboarding schema.
 *
 * Dedicated schema for creators connecting to the WebRectangle platform.
 * Captures their identity, primary platform, content specialisms, and
 * audience metrics for review before publishing into public discovery.
 */
export const creatorApplicationSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+0-9 ()-]*$/, 'Use digits, spaces and + ( ) - only.')
    .optional()
    .or(z.literal('')),
  handle: z
    .string()
    .trim()
    .min(1, 'Handle is required')
    .transform((h) => h.replace(/^@/, '')),
  displayName: z.string().trim().max(120).optional(),
  platform: platformSchema,
  category: categorySchema,
  niche: z.string().trim().min(2, 'Niche is required').max(120),
  city: z.string().trim().min(2, 'City is required').max(120),
  region: z.string().trim().min(2, 'State or region is required').max(120),
  languages: z.array(z.string().trim().min(1)).min(1, 'Specify at least one language'),
  contentTypes: z.array(contentTypeSchema).min(1, 'Select at least one content format'),
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters').max(2000),
  estimatedFollowers: z.number().int().nonnegative().optional(),
  portfolioLinks: z.array(z.string().url('Must be a valid URL')).optional(),
  startingRateInr: z.number().int().nonnegative().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type CreatorApplicationInput = z.infer<typeof creatorApplicationSchema>;
