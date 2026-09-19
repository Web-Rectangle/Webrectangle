import { cn } from '@/lib/utils/cn';

/**
 * Small uppercase section label preceded by a brand square.
 *
 * The square is the rectangle motif in miniature and is the reason this
 * component exists rather than a utility class - it appears above nearly every
 * section heading on the site and must stay consistent.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-accent inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.12em] uppercase',
        className,
      )}
    >
      <span aria-hidden="true" className="bg-accent size-2 rounded-[2px]" />
      {children}
    </span>
  );
}
