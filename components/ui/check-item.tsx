import { cn } from '@/lib/utils/cn';

/**
 * Checklist row with the legacy circular brand tick.
 *
 * The 26px filled circle with a 3px white stroke is carried over verbatim from
 * the old site's `.chk` treatment.
 */
export function CheckItem({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={cn('flex items-start gap-3.5', className)}>
      <span
        aria-hidden="true"
        className="bg-accent mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" className="size-[13px]">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div>
        {title ? <strong className="text-ink block text-[16.5px] font-bold">{title}</strong> : null}
        <span className="text-[14.5px]">{children}</span>
      </div>
    </li>
  );
}
