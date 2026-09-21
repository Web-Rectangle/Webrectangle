'use client';

import { X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type ChipProps = {
  children: React.ReactNode;
  /** Toggle state for filter chips. */
  selected?: boolean;
  onToggle?: () => void;
  /** Renders a clear affordance and calls onToggle when pressed. */
  removable?: boolean;
  className?: string;
};

/**
 * Filter pill used across the creator discovery surfaces.
 *
 * Renders as a real `<button>` with `aria-pressed` when interactive so that
 * screen readers announce the selected state, and as a plain `<span>` when it
 * is purely presentational.
 */
export function Chip({ children, selected = false, onToggle, removable, className }: ChipProps) {
  const shared = cn(
    // min-h-10 rather than padding alone: at py-1.5 these were 32px tall,
    // well under a comfortable touch target, and the filter rail is used
    // almost entirely with a thumb on mobile.
    'inline-flex min-h-10 items-center gap-1.5 rounded-[var(--r-pill)] border px-4 py-2',
    'text-[13.5px] font-semibold transition-colors duration-200',
    selected
      ? 'bg-accent text-accent-contrast border-accent'
      : 'bg-surface text-body border-border hover:border-accent hover:text-accent',
    className,
  );

  if (!onToggle) {
    return <span className={shared}>{children}</span>;
  }

  return (
    <button type="button" aria-pressed={selected} onClick={onToggle} className={shared}>
      {children}
      {removable && selected ? <X aria-hidden="true" className="size-3.5" /> : null}
    </button>
  );
}
