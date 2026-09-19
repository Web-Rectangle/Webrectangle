import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

import { ArrowIcon } from './arrow-icon';

type Variant = 'primary' | 'outline' | 'white' | 'ghost' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Append the signature north-east CTA arrow. */
  withArrow?: boolean;
  fullWidth?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
    /** Opens in a new tab and applies the matching rel. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE = [
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap',
  'rounded-[var(--r-btn)] border border-transparent font-semibold',
  'transition-[background-color,border-color,color,box-shadow,transform] duration-250',
  'disabled:pointer-events-none disabled:opacity-55',
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
].join(' ');

const VARIANT: Record<Variant, string> = {
  // Legacy primary: brand fill, lifts 2px with a brand-tinted shadow on hover.
  primary:
    'bg-accent text-accent-contrast hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-accent',
  outline:
    'bg-surface text-ink border-border hover:border-accent hover:text-accent hover:-translate-y-0.5',
  // For use on the brand-gradient CTA band.
  white:
    'bg-white text-brand-600 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(0_0_0_/_0.2)]',
  ghost: 'bg-transparent text-white border-white/50 hover:border-white hover:-translate-y-0.5',
  subtle: 'bg-accent-soft text-accent hover:bg-accent hover:text-accent-contrast',
};

const SIZE: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-[26px] py-[14px] text-[15.5px]',
  lg: 'px-8 py-[17px] text-[16.5px]',
};

/**
 * Primary interactive control. Renders an `<a>` when `href` is supplied and a
 * `<button>` otherwise, so callers never have to nest a link inside a button.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    withArrow = false,
    fullWidth = false,
    className,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANT[variant], SIZE[size], fullWidth && 'w-full', className);

  const content = (
    <>
      {children}
      {withArrow ? <ArrowIcon /> : null}
    </>
  );

  if (typeof props.href === 'string') {
    const { href, external, ...anchorRest } = rest as Omit<ButtonAsLink, keyof CommonProps>;

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
