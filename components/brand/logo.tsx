import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

type LogoProps = {
  /** Render as a link to home. Set false inside an element that is already a link. */
  asLink?: boolean;
  /** `mono` renders both words in the current text colour, for dark/photographic backgrounds. */
  variant?: 'default' | 'mono';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE: Record<NonNullable<LogoProps['size']>, { text: string; pad: string }> = {
  sm: { text: 'text-[18px]', pad: 'px-[8px] pt-[2px] pb-[3px]' },
  md: { text: 'text-[22px]', pad: 'px-[10px] pt-[3px] pb-[4px]' },
  lg: { text: 'text-[28px]', pad: 'px-[13px] pt-[4px] pb-[5px]' },
};

/**
 * The WebRectangle lockup: "Web" in ink, "Rectangle" reversed out of a rounded
 * brand-blue rectangle.
 *
 * This is the single most important piece of brand equity carried over from
 * the previous site, and the rectangle itself is the literal brand motif. The
 * geometry (8px radius, asymmetric vertical padding, 4px gap) is reproduced
 * from the legacy stylesheet rather than re-derived.
 */
export function Logo({ asLink = true, variant = 'default', size = 'md', className }: LogoProps) {
  const s = SIZE[size];

  const content = (
    <span
      className={cn(
        'inline-flex items-center font-extrabold tracking-[-0.02em] whitespace-nowrap',
        s.text,
        className,
      )}
    >
      <span className={variant === 'mono' ? 'text-current' : 'text-ink'}>Web</span>
      <span
        className={cn(
          'ml-[4px] rounded-[8px]',
          s.pad,
          variant === 'mono'
            ? 'border border-current text-current'
            : 'bg-accent text-accent-contrast',
        )}
      >
        Rectangle
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label="WebRectangle home" className="inline-flex">
      {content}
    </Link>
  );
}
