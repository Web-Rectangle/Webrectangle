'use client';

import { ShieldCheck } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { type AdminFormState, adminLogin } from '@/lib/actions/admin';

const initial: AdminFormState = { status: 'idle' };

/**
 * Admin sign-in.
 *
 * One password field, because there is one admin. No email, no "remember me",
 * no password reset - every one of those would be surface area protecting a
 * single internal login.
 *
 * `usingDevPassword` is passed down so a local clone tells you the fallback
 * rather than leaving you guessing; it is never true in production.
 */
export function AdminLoginForm({ usingDevPassword }: { usingDevPassword: boolean }) {
  const [state, formAction] = useActionState<AdminFormState, FormData>(adminLogin, initial);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Admin password" htmlFor="admin-password" required>
        <Input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={state.status === 'error'}
          aria-describedby="admin-password-error"
        />
      </Field>

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="bg-critical-soft text-critical rounded-[var(--r-btn)] px-4 py-3 text-[14px] font-medium"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      {usingDevPassword ? (
        <p className="text-muted border-border rounded-[var(--r-btn)] border border-dashed px-3 py-2.5 text-[12.5px]">
          Development only: the password is{' '}
          <code className="text-ink font-mono font-semibold">webrectangle</code>. Set{' '}
          <code className="font-mono">ADMIN_PASSWORD</code> before deploying.
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" fullWidth disabled={pending}>
      <ShieldCheck aria-hidden="true" className="size-4" />
      {pending ? 'Checking...' : 'Sign in to admin'}
    </Button>
  );
}
