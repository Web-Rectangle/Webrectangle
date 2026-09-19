'use client';

import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Glass } from '@/components/ui/glass';
import { SpamGuard } from '@/components/ui/spam-guard';
import { type FormState, initialFormState, submitLead } from '@/lib/actions/submit-lead';
import type { AudienceType, LeadSource } from '@/lib/schemas/lead';

/**
 * Enquiry form.
 *
 * Progressive enhancement is real here, not nominal: this is a plain `<form>`
 * bound to a Server Action, so it submits and succeeds with JavaScript
 * disabled. `useActionState` only adds the pending state and inline errors.
 *
 * On success the form is replaced by a confirmation that also offers WhatsApp.
 * That is the visible half of the no-dropped-leads guarantee - if our email or
 * Slack integration is down, the visitor still has a channel that works.
 */
export function LeadForm({
  source = 'contact',
  defaultAudience = 'brand',
  heading,
}: {
  source?: LeadSource;
  defaultAudience?: AudienceType;
  heading?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(submitLead, initialFormState);

  if (state.status === 'success') {
    return (
      <Glass className="glass-readable p-8 text-center">
        <CheckCircle2 aria-hidden="true" className="text-positive mx-auto mb-4 size-10" />
        <h2 className="mb-2 text-[22px]">Message received</h2>
        <p className="mx-auto mb-6 max-w-sm text-[15px]">{state.message}</p>

        {state.whatsappUrl ? (
          <Button href={state.whatsappUrl} external variant="outline">
            <MessageCircle aria-hidden="true" className="size-4" />
            Continue on WhatsApp
          </Button>
        ) : null}
      </Glass>
    );
  }

  return (
    <Glass as="div" className="glass-readable relative p-6 md:p-8">
      <form action={formAction} className="grid gap-5 md:grid-cols-2" noValidate>
        {heading ? <h2 className="text-[22px] md:col-span-2">{heading}</h2> : null}

        <input type="hidden" name="source" value={source} />
        <SpamGuard />

        <Field label="Name" htmlFor="lead-name" required error={state.errors?.name}>
          <Input
            id="lead-name"
            name="name"
            autoComplete="name"
            required
            placeholder="Your name"
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby="lead-name-error"
          />
        </Field>

        <Field label="Company" htmlFor="lead-company" error={state.errors?.company}>
          <Input
            id="lead-company"
            name="company"
            autoComplete="organization"
            placeholder="Brand or company name"
          />
        </Field>

        <Field label="Email" htmlFor="lead-email" required error={state.errors?.email}>
          <Input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby="lead-email-error"
          />
        </Field>

        <Field label="Phone or WhatsApp" htmlFor="lead-phone" error={state.errors?.phone}>
          <Input id="lead-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 ..." />
        </Field>

        <Field
          label="I am a"
          htmlFor="lead-audience"
          hint="Helps us route your message to the right person."
          className="md:col-span-2"
        >
          <Select id="lead-audience" name="audience" defaultValue={defaultAudience}>
            <option value="brand">Brand or marketing team</option>
            <option value="creator">Creator</option>
            <option value="other">Something else</option>
          </Select>
        </Field>

        <Field
          label="What are you planning?"
          htmlFor="lead-message"
          required
          error={state.errors?.message}
          className="md:col-span-2"
        >
          <Textarea
            id="lead-message"
            name="message"
            required
            placeholder="Product, audience, rough budget and timeline - whatever you have so far."
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby="lead-message-error"
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

        <div className="md:col-span-2">
          <SubmitButton />
        </div>

        <p className="text-muted text-[12.5px] md:col-span-2">
          We use your details to reply to this enquiry and nothing else. See our{' '}
          <a href="/privacy" className="hover:text-accent underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
      </form>
    </Glass>
  );
}

/**
 * Split out because `useFormStatus` reads the state of the nearest parent
 * form, which means it has to live in a child of that form rather than
 * alongside it.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" fullWidth withArrow={!pending} disabled={pending}>
      {pending ? 'Sending...' : 'Send message'}
    </Button>
  );
}
