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
}: {
  status: FeatureStatus;
  className?: string;
  showDot?: boolean;
}) {
  const config = CONFIG[status];

  return (
    <span
      title={config.description}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border px-2.5 py-1',
        'text-[11px] font-bold tracking-[0.08em] uppercase',
        config.chip,
        className,
      )}
    >
      {showDot ? (
        <span aria-hidden="true" className={cn('size-1.5 rounded-full', config.dot)} />
      ) : null}
      {config.label}
      <span className="sr-only">. {config.description}</span>
    </span>
  );
}
