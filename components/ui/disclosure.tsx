import { cn } from '@/lib/utils/cn';

/**
 * FAQ accordion item.
 *
 * Built on native `<details>`/`<summary>`, exactly as the legacy site was. This
 * is deliberate: the browser gives us keyboard support, correct ARIA semantics
 * and in-page find-on-page expansion for free, none of which a hand-rolled
 * accordion reliably gets right. The only custom behaviour is the `+` glyph
 * rotating 45 degrees into an `x` when open.
 *
 * `name` groups items into a single-open accordion (native exclusive
 * disclosure); omit it to allow several open at once.
 */
export function Disclosure({
  question,
  children,
  name,
  className,
}: {
  question: string;
  children: React.ReactNode;
  name?: string;
  className?: string;
}) {
  return (
    <details
      name={name}
      className={cn(
        'group border-border bg-surface-raised mb-3.5 overflow-hidden rounded-[14px] border',
        'transition-shadow duration-300 open:shadow-[var(--shadow)]',
        className,
      )}
    >
      <summary
        className={cn(
          'text-ink flex cursor-pointer list-none items-center justify-between gap-4',
          'px-6 py-5 text-[16.5px] font-bold',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        {question}
        <span
          aria-hidden="true"
          className={cn(
            'bg-accent-soft text-accent flex size-7 shrink-0 items-center justify-center',
            'rounded-full text-lg leading-none font-bold',
            'transition-transform duration-300 group-open:rotate-45',
            'motion-reduce:transition-none',
          )}
        >
          +
        </span>
      </summary>
      <div className="px-6 pb-[22px] text-[15px] leading-relaxed">{children}</div>
    </details>
  );
}
