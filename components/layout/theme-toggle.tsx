'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useIsMounted } from '@/lib/hooks/use-client-state';
import { cn } from '@/lib/utils/cn';

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const;

/**
 * Three-way theme switch: light, system, dark.
 *
 * Rendered as a radiogroup rather than a single toggle so "follow my OS" stays
 * reachable - a two-state toggle silently strands anyone who wants the system
 * setting back.
 *
 * The `mounted` gate exists because the resolved theme is unknown during SSR;
 * rendering the real state before hydration would mismatch. A same-size
 * placeholder is emitted instead so the header does not shift.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return <div aria-hidden="true" className={cn('h-9 w-[104px]', className)} />;
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        'border-border bg-surface-alt flex gap-0.5 rounded-full border p-0.5',
        className,
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              'flex size-8 items-center justify-center rounded-full transition-colors duration-200',
              active ? 'bg-accent text-accent-contrast' : 'text-muted hover:text-ink',
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
