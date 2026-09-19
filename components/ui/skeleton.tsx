import { cn } from '@/lib/utils/cn';

/**
 * Loading placeholder. `role="presentation"` keeps it out of the accessibility
 * tree - the surrounding region should carry `aria-busy` instead so assistive
 * tech announces the loading state once rather than per shape.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn(
        'bg-surface-alt animate-shimmer rounded-[10px] motion-reduce:animate-none',
        className,
      )}
    />
  );
}
