import { cn } from '@/lib/utils/cn';

/**
 * Shared input chrome, inherited from the legacy form styling: tinted resting
 * background that turns white on focus, plus a 4px brand focus ring.
 */
const CONTROL = [
  'w-full rounded-[10px] border border-border bg-surface-alt',
  'px-4 py-[13px] text-[15px] text-ink font-[inherit]',
  'placeholder:text-muted',
  'transition-[border-color,box-shadow,background-color] duration-200',
  'focus:outline-none focus:border-accent focus:bg-surface',
  'focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_12%,transparent)]',
  'disabled:opacity-60 disabled:cursor-not-allowed',
  'aria-[invalid=true]:border-critical aria-[invalid=true]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--critical)_12%,transparent)]',
].join(' ');

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  /** Validation message. Rendered in an aria-live region and wired via aria-describedby. */
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Label + control + hint/error wrapper.
 *
 * Owns the accessible wiring so individual forms cannot forget it: the error
 * is announced politely on change and referenced by the control through
 * `aria-describedby`.
 */
export function Field({ label, htmlFor, required, error, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-ink mb-[7px] block text-[13.5px] font-semibold">
        {label}
        {required ? (
          <span className="text-accent ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      {children}

      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-muted mt-1.5 text-[12.5px]">
          {hint}
        </p>
      ) : null}

      <p
        id={`${htmlFor}-error`}
        aria-live="polite"
        className={cn('text-critical mt-1.5 text-[12.5px] font-medium', !error && 'sr-only')}
      >
        {error ?? ''}
      </p>
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, 'min-h-30 resize-y', className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, 'cursor-pointer appearance-none pr-10', className)} {...props}>
      {children}
    </select>
  );
}
