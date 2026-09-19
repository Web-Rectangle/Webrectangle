import { Eyebrow } from '@/components/brand/eyebrow';
import { cn } from '@/lib/utils/cn';

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  /** Optional trailing slot, e.g. a link or status badge, shown beside the title on wide screens. */
  aside?: React.ReactNode;
  className?: string;
  /** Heading level. Defaults to h2; use h1 only in a hero. */
  as?: 'h1' | 'h2' | 'h3';
};

/**
 * Standard section header: eyebrow, heading and optional supporting copy.
 *
 * The legacy site laid these out as a two-column `.sec-head` with the
 * description right-aligned against the title; that pattern is preserved via
 * the `aside` slot.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  aside,
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-14 flex flex-wrap items-end justify-between gap-10',
        align === 'center' && 'flex-col items-center justify-center text-center',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'max-w-2xl')}>
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <Tag
          className={cn(
            Tag === 'h1' ? 'text-[clamp(40px,5.6vw,72px)]' : 'text-[clamp(30px,4vw,42px)]',
          )}
        >
          {title}
        </Tag>
        {description && align === 'center' ? (
          <p className="mx-auto mt-4 max-w-2xl text-[17px]">{description}</p>
        ) : null}
      </div>

      {description && align === 'left' ? (
        <div className="max-w-[420px]">
          <p>{description}</p>
          {aside}
        </div>
      ) : (
        aside
      )}
    </div>
  );
}

/**
 * Inline highlight - white text on a brand-filled rounded rectangle.
 *
 * Inherited from the legacy `.hl` treatment. High-signal by design: use it
 * once per page, inside the main heading.
 */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-accent text-accent-contrast inline-block rounded-[12px] px-3.5 pb-1 leading-[1.15]">
      {children}
    </span>
  );
}
