import type { Platform } from '@/lib/schemas/creator';
import { cn } from '@/lib/utils/cn';

const CONFIG: Record<Platform, { label: string; className: string }> = {
  instagram: { label: 'Instagram', className: 'bg-[#E1306C]/10 text-[#C13584]' },
  youtube: { label: 'YouTube', className: 'bg-[#FF0000]/10 text-[#CC0000]' },
};

/**
 * Platform marker on a creator card.
 *
 * Uses a tinted platform colour rather than a logo: reproducing Instagram and
 * YouTube marks inside our own UI raises trademark questions and would imply a
 * partnership or API integration we do not have.
 */
export function PlatformBadge({ platform, className }: { platform: Platform; className?: string }) {
  const config = CONFIG[platform];

  return (
    <span
      className={cn(
        'shrink-0 rounded-[var(--r-pill)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.04em] uppercase',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
