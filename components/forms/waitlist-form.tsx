'use client';

import { CheckCircle2 } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { SpamGuard } from '@/components/ui/spam-guard';
import { type FormState, initialFormState, joinWaitlist } from '@/lib/actions/submit-lead';
import type { AudienceType, LeadSource } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils/cn';

/**
 * Single-field early-access capture.
 *
 * Deliberately just an email. Every additional field measurably costs signups,
 * and at this stage an address we can write to is worth more than a complete
 * profile we guessed at. Everything else is asked later, when the person has a
 * reason to answer.
 */
export function WaitlistForm({
  audience,
  source,
  submitLabel = 'Get early access',
  className,
}: {
  audience: AudienceType;
  source: LeadSource;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(joinWaitlist, initialFormState);

  if (state.status === 'success') {
    return (
      <p
        role="status"
        className={cn(
          'bg-positive-soft text-positive flex items-center gap-2.5 rounded-[var(--r-card)] px-4 py-3.5 text-[14.5px] font-semibold',
          className,
        )}
      >
        <CheckCircle2 aria-hidden="true" className="size-4.5 shrink-0" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className={cn('space-y-3', className)} noValidate>
      <input type="hidden" name="audience" value={audience} />
      <input type="hidden" name="source" value={source} />
      <SpamGuard />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Field
          label="Email"
          htmlFor={`wl-${source}`}
          error={state.errors?.email}
          className="flex-1"
        >
          <Input
            id={`wl-${source}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={`wl-${source}-error`}
          />
        </Field>

        <div className="sm:pt-[27px]">
          <SubmitButton label={submitLabel} />
        </div>
      </div>

      {state.status === 'error' && state.message ? (
        <p role="alert" className="text-critical text-[13px] font-medium">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} withArrow={!pending}>
      {pending ? 'Adding...' : label}
    </Button>
  );
}
