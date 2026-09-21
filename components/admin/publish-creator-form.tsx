'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { type AdminFormState, publishCreator, saveCreator } from '@/lib/actions/admin';
import { CATEGORIES, CONTENT_TYPES, type Creator, PLATFORMS, TIERS } from '@/lib/schemas/creator';
import { humanise } from '@/lib/utils/format';

const AGE_BANDS = ['13-17', '18-24', '25-34', '35-44', '45+'] as const;

const initial: AdminFormState = { status: 'idle' };

/**
 * Profile form for an approved creator.
 *
 * WHY THIS STEP EXISTS: a creator signs up with a name, an email and a
 * paragraph. That is nowhere near enough for a brand to make a decision, and
 * listing them on it would make discovery useless. Approval says "we want to
 * work with them"; this form is where an admin fills in what a brand actually
 * filters on.
 *
 * Every field maps directly onto the Creator schema, so anything published
 * here behaves identically to the seed profiles in search, filtering and
 * comparison.
 *
 * `existing` is passed when re-editing, so the form doubles as the edit view
 * rather than needing a second near-identical screen.
 *
 * TWO ENTRY POINTS, ONE FORM. With a `submissionId` it publishes an approved
 * signup and links the two records together. Without one it saves a standalone
 * profile - necessary because plenty of creators are people the team already
 * works with, and making an admin fake a form submission to list them would be
 * ridiculous. Both paths share `parseCreatorForm` server-side, so they cannot
 * validate differently.
 */
export function PublishCreatorForm({
  submissionId,
  defaults,
  existing,
}: {
  /** Omit when creating a profile directly, with no submission behind it. */
  submissionId?: string;
  /** Pre-fill hints derived from the submission itself. */
  defaults: { displayName: string; handle: string };
  existing?: Creator | null;
}) {
  const [state, formAction] = useActionState<AdminFormState, FormData>(
    submissionId ? publishCreator : saveCreator,
    initial,
  );

  return (
    <form action={formAction} className="grid gap-5 md:grid-cols-2">
      {submissionId ? (
        <input type="hidden" name="submissionId" value={submissionId} />
      ) : (
        // Carries the id on edit so the upsert updates rather than duplicating.
        <input type="hidden" name="creatorId" value={existing?.id ?? ''} />
      )}

      <Field label="Display name" htmlFor="displayName" required>
        <Input
          id="displayName"
          name="displayName"
          required
          defaultValue={existing?.displayName ?? defaults.displayName}
        />
      </Field>

      <Field label="Handle" htmlFor="handle" required hint="Without the @">
        <Input
          id="handle"
          name="handle"
          required
          defaultValue={existing?.handle ?? defaults.handle}
          placeholder="fitwithriya"
        />
      </Field>

      <Field label="Platform" htmlFor="platform" required>
        <Select id="platform" name="platform" defaultValue={existing?.platform ?? 'instagram'}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {humanise(p)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Category" htmlFor="category" required>
        <Select id="category" name="category" defaultValue={existing?.category ?? 'lifestyle'}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {humanise(c)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Niche"
        htmlFor="niche"
        required
        hint="The specific thing they make, e.g. strength training for beginners"
        className="md:col-span-2"
      >
        <Input id="niche" name="niche" required defaultValue={existing?.niche} />
      </Field>

      <Field label="City" htmlFor="city" required>
        <Input
          id="city"
          name="city"
          required
          defaultValue={existing?.city}
          placeholder="Delhi NCR"
        />
      </Field>

      <Field label="Region" htmlFor="region" required>
        <Input
          id="region"
          name="region"
          required
          defaultValue={existing?.region}
          placeholder="North India"
        />
      </Field>

      <Field
        label="Languages"
        htmlFor="languages"
        required
        hint="Comma separated"
        className="md:col-span-2"
      >
        <Input
          id="languages"
          name="languages"
          required
          defaultValue={existing?.languages.join(', ')}
          placeholder="Hindi, English"
        />
      </Field>

      <Field label="Followers" htmlFor="followers" required>
        <Input
          id="followers"
          name="followers"
          type="number"
          min={0}
          required
          defaultValue={existing?.followers}
        />
      </Field>

      <Field label="Engagement rate" htmlFor="engagementRate" required hint="Percentage, e.g. 5.4">
        <Input
          id="engagementRate"
          name="engagementRate"
          type="number"
          step="0.1"
          min={0}
          max={100}
          required
          defaultValue={existing?.engagementRate}
        />
      </Field>

      <Field label="Average views" htmlFor="avgViews" required>
        <Input
          id="avgViews"
          name="avgViews"
          type="number"
          min={0}
          required
          defaultValue={existing?.avgViews}
        />
      </Field>

      <Field label="Size band" htmlFor="tier" required>
        <Select id="tier" name="tier" defaultValue={existing?.tier ?? 'micro'}>
          {TIERS.map((t) => (
            <option key={t} value={t}>
              {humanise(t)}
            </option>
          ))}
        </Select>
      </Field>

      <fieldset className="md:col-span-2">
        <legend className="text-ink mb-2 block text-[13.5px] font-semibold">
          Content types <span className="text-accent">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {CONTENT_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-[14px]">
              <input
                type="checkbox"
                name="contentTypes"
                value={type}
                defaultChecked={existing?.contentTypes.includes(type) ?? type === 'reel'}
                className="accent-accent size-4"
              />
              {humanise(type)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="border-border mt-2 border-t pt-6 md:col-span-2">
        <h2 className="mb-1 text-[18px]">Audience</h2>
        <p className="mb-5 text-[14px]">
          What brands filter on when reach alone is not the question.
        </p>
      </div>

      <Field label="Main age band" htmlFor="primaryAgeBand" required>
        <Select
          id="primaryAgeBand"
          name="primaryAgeBand"
          defaultValue={existing?.audience.primaryAgeBand ?? '25-34'}
        >
          {AGE_BANDS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Share in that band" htmlFor="primaryAgeShare" required hint="Percentage, 0-100">
        <Input
          id="primaryAgeShare"
          name="primaryAgeShare"
          type="number"
          min={0}
          max={100}
          required
          defaultValue={existing?.audience.primaryAgeShare ?? 50}
        />
      </Field>

      <Field label="Women in audience" htmlFor="femaleShare" required hint="Percentage, 0-100">
        <Input
          id="femaleShare"
          name="femaleShare"
          type="number"
          min={0}
          max={100}
          required
          defaultValue={existing?.audience.femaleShare ?? 50}
        />
      </Field>

      <Field label="Top audience locations" htmlFor="topLocations" required hint="Comma separated">
        <Input
          id="topLocations"
          name="topLocations"
          required
          defaultValue={existing?.audience.topLocations.join(', ')}
          placeholder="Delhi NCR, Jaipur, Lucknow"
        />
      </Field>

      <Field label="Past collaborations" htmlFor="pastCollaborations" required>
        <Input
          id="pastCollaborations"
          name="pastCollaborations"
          type="number"
          min={0}
          required
          defaultValue={existing?.pastCollaborations ?? 0}
        />
      </Field>

      <Field label="Bio" htmlFor="bio" required className="md:col-span-2">
        <Textarea
          id="bio"
          name="bio"
          required
          defaultValue={existing?.bio}
          placeholder="One or two lines a brand would find useful."
        />
      </Field>

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="bg-critical-soft text-critical rounded-[var(--r-btn)] px-4 py-3 text-[14px] font-medium md:col-span-2"
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <SubmitButton editing={Boolean(existing)} />
        <Button href={submissionId ? '/admin' : '/admin/creators'} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? 'Saving...' : editing ? 'Update listing' : 'Publish to discovery'}
    </Button>
  );
}
