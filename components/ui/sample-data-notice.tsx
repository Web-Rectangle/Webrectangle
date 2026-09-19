import { Info } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

/**
 * Label marking a block of illustrative product data.
 *
 * WHY THIS EXISTS: the interactive creator cards in the hero and on /discover
 * are a product demonstration built on invented profiles. Presenting them
 * without a label would imply we already have a live creator network, which
 * the brand brief explicitly forbids. Every surface that renders seed data
 * must render one of these alongside it.
 *
 * `chip` is the compact form for tight corners; `bar` is the full-width form
 * used at the top of a demo region.
 */
export function SampleDataNotice({
  variant = 'chip',
  label = 'Sample data',
  detail = 'Illustrative profiles shown to demonstrate the product. Our creator network is onboarding now.',
  className,
}: {
  variant?: 'chip' | 'bar';
  label?: string;
  detail?: string;
  className?: string;
}) {
  if (variant === 'chip') {
    return (
      <span
        title={detail}
        className={cn(
          'glass-sm text-body inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-3 py-1.5',
          'text-[11px] font-semibold tracking-[0.06em] uppercase',
          className,
        )}
      >
        <Info aria-hidden="true" className="size-3" />
        {label}
        <span className="sr-only">. {detail}</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'border-border bg-surface-alt flex items-start gap-3 rounded-[var(--r-card)] border px-4 py-3',
        className,
      )}
    >
      <Info aria-hidden="true" className="text-accent mt-0.5 size-4 shrink-0" />
      <p className="text-[13.5px] leading-relaxed">
        <span className="text-ink font-semibold">{label}.</span> {detail}
      </p>
    </div>
  );
}
