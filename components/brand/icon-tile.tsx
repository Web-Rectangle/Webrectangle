import { cn } from '@/lib/utils/cn';

type IconTileProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** `soft` is the low-emphasis variant used where a gradient tile would shout. */
  variant?: 'gradient' | 'soft';
  className?: string;
};

const SIZE: Record<NonNullable<IconTileProps['size']>, string> = {
  sm: 'size-11 rounded-[12px] [&_svg]:size-5',
  md: 'size-[52px] rounded-[14px] [&_svg]:size-6',
  lg: 'size-16 rounded-[18px] [&_svg]:size-8',
};

/**
 * Rounded square icon container.
 *
 * Inherited from the legacy site, which used the gradient variant everywhere -
 * the resulting "wall of identical blue tiles" was called out as a weakness in
 * the redesign brief. Budget is at most six gradient tiles per page; reach for
 * the `soft` variant beyond that.
 */
export function IconTile({
  children,
  size = 'md',
  variant = 'gradient',
  className,
}: IconTileProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center',
        SIZE[size],
        // Gradient runs accent -> accent-secondary, which is blue-to-deeper-blue
        // in light and blue-to-violet in dark. See styles/tokens.css.
        variant === 'gradient'
          ? 'from-brand-fill-from to-brand-fill-to bg-gradient-to-br text-white [&_svg]:stroke-white'
          : 'bg-accent-soft text-accent [&_svg]:stroke-current',
        className,
      )}
    >
      {children}
    </div>
  );
}
