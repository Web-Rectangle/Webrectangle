import { cn } from '@/lib/utils/cn';

type GlassProps = {
  children: React.ReactNode;
  /**
   * `sm` chips and pills, `md` panels and cards, `dark` for use on the brand
   * gradient band. See styles/glass.css for the material definitions.
   */
  tier?: 'sm' | 'md' | 'dark';
  /**
   * Raises opacity for panels carrying paragraph-length copy. Decorative glass
   * can stay translucent; text needs the contrast headroom.
   */
  readable?: boolean;
  float?: boolean;
  as?: 'div' | 'aside' | 'article' | 'li';
  className?: string;
  style?: React.CSSProperties;
};

const TIER = {
  sm: 'glass-sm rounded-[var(--r-pill)]',
  md: 'glass-md',
  dark: 'glass-dark rounded-[var(--r-glass)]',
} as const;

/**
 * Frosted panel. Thin wrapper over the CSS material classes so that tier
 * choice is explicit at the call site and easy to audit - the performance
 * budget caps simultaneously visible glass at roughly eight elements.
 */
export function Glass({
  children,
  tier = 'md',
  readable = false,
  float = false,
  as: Tag = 'div',
  className,
  style,
}: GlassProps) {
  return (
    <Tag
      className={cn(
        TIER[tier],
        readable && 'glass-readable',
        float && 'animate-floaty motion-reduce:animate-none',
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
