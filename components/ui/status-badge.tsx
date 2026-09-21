import { cn } from '@/lib/utils/cn';

export type FeatureStatus = 'live' | 'beta' | 'building';

const CONFIG: Record<
  FeatureStatus,
  { label: string; description: string; dot: string; chip: string }
> = {
  live: {
    label: 'Live',
    description: 'Available today.',
    dot: 'bg-positive',
    chip: 'bg-positive-soft text-positive border-positive/20',
  },
  beta: {
    label: 'Beta',
    description: 'Working, but still being refined with early users.',
    dot: 'bg-warning',
    chip: 'bg-warning-soft text-warning border-warning/20',
  },
  building: {
    label: 'Building',
    description: 'On the roadmap. Not available yet.',
    dot: 'bg-accent',
    chip: 'bg-accent-soft text-accent border-accent/20',
  },
};

/**
 * Honest availability marker for a feature.
 *
 * WHY THIS EXISTS: WebRectangle is pre-launch, and the brand brief forbids
 * implying that roadmap features already work. Rather than hiding unbuilt
 * capability or overclaiming it, every feature block states where it actually
 * is. A capability marked "Building" is truthful and reads as a product team
 * with a plan, which is a stronger trust signal at this stage than vague
 * confidence would be.
 *
 * The `title` carries the plain-language meaning for anyone unsure what the
 * label implies.
 */
export function StatusBadge({
  status,
  className,
  showDot = true,
  /**
   * `nav` is a tighter, shorter form for navigation, where the full badge
   * crowds the link and widens the bar. It reads "Soon" rather than
   * "Building", because someone scanning a menu needs the implication, not our
   * internal label.
   */
  size = 'default',
}: {
  status: FeatureStatus;
  className?: string;
  showDot?: boolean;
  size?: 'default' | 'nav';
}) {
  const config = CONFIG[status];
  const nav = size === 'nav';
  const label = nav && status === 'building' ? 'Soon' : config.label;

  return (
    <span
      title={config.description}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[var(--r-pill)] border font-bold uppercase',
        // Explicit height and flat leading in the nav form: relying on padding
        // plus the inherited 15px line-height made the pill taller than its
        // text and pushed it off the label's centre line.
        nav
          ? 'h-[18px] gap-1 px-1.5 text-[9.5px] leading-none tracking-[0.06em]'
          : 'gap-1.5 px-2.5 py-1 text-[11px] tracking-[0.08em]',
        config.chip,
        className,
      )}
    >
      {showDot && !nav ? (
        <span aria-hidden="true" className={cn('size-1.5 rounded-full', config.dot)} />
      ) : null}
      {label}
      <span className="sr-only">. {config.description}</span>
    </span>
  );
}
