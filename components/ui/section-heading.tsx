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
 *
 * ONE BOX, NO DEAD SPACE - the tricky part. A wrapped `inline-block` is sized
 * by CSS shrink-to-fit, which resolves to the full available width whenever
 * the text is too long to fit on one line. That is what leaves a slab of empty
 * blue beside a short final line, and no combination of `w-fit`,
 * `max-content` or `fit-content` avoids it: CSS has no way to shrink a wrapped
 * box back to its longest rendered line.
 *
 * The fix is to make the break explicit. With `white-space: pre-line` the
 * max-content width becomes the longest newline-delimited segment rather than
 * the whole string, so shrink-to-fit lands exactly on the longest line and the
 * rectangle hugs the text on all four sides.
 *
 * Author the break with a newline in the copy, e.g. 'Build better\ncampaigns.'
 * in lib/content/home.ts. Text without a newline is unaffected, and on a
 * viewport too narrow even for the longest segment it still wraps normally
 * rather than overflowing.
 *
 * PADDING: `leading-[1.1]` is deliberately tight. Half-leading is baked into
 * every line box, so at a looser line-height the visual gap above and below
 * the glyphs would exceed the side padding and the box would read as
 * vertically padded even with equal values on all four sides.
 */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-accent text-accent-contrast inline-block max-w-full rounded-[14px] p-4 leading-[1.1] whitespace-pre-line">
      {children}
    </span>
  );
}
