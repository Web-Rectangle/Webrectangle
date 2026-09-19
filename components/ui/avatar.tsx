import { cn } from '@/lib/utils/cn';

/** Deterministic hue so the same handle always gets the same tint across renders. */
function hueFor(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  }
  // Constrain to the blue-violet-teal arc so avatars stay on-brand rather than
  // turning the grid into a rainbow.
  return 195 + (hash % 70);
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('') || '?';
}

const SIZE = {
  sm: 'size-9 text-[12px]',
  md: 'size-12 text-[15px]',
  lg: 'size-16 text-[20px]',
} as const;

/**
 * Generated initials avatar.
 *
 * Deliberately not a photograph. The creator profiles on this site are
 * illustrative sample data, and attaching real or stock faces to invented
 * profiles would imply a creator network we do not yet have. Initials on a
 * brand-tinted disc read as a product placeholder, which is what they are.
 */
export function Avatar({
  name,
  seed,
  size = 'md',
  className,
}: {
  name: string;
  /** Defaults to `name`. Pass a handle to keep the tint stable if display names change. */
  seed?: string;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const hue = hueFor(seed ?? name);

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        'ring-2 ring-white/70 dark:ring-white/10',
        SIZE[size],
        className,
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 92% 62%), hsl(${hue + 18} 88% 46%))`,
        color: '#fff',
      }}
    >
      {initialsFor(name)}
    </span>
  );
}
