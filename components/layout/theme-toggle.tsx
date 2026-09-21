'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useIsMounted } from '@/lib/hooks/use-client-state';
import { cn } from '@/lib/utils/cn';

/**
 * Light/dark theme switch.
 *
 * Two explicit choices with light as the default rather than following the
 * operating system. Light is the brand's primary presentation - the palette,
 * the glass material and the product screenshots are all designed for it - so
 * a first-time visitor on a dark-mode laptop still sees the site the way it
 * was designed before choosing otherwise.
 *
 * WHY A SLIDING INDICATOR AND NOT TWO PLAIN BUTTONS: the previous version was
 * two separate <button>s, and a browser only fires `click` when mousedown and
 * mouseup land on the same element. Pressing on one half and releasing a few
 * pixels away - which is what happens if you treat it like a switch and drag -
 * silently did nothing. The whole control is now one button, so a press
 * anywhere in it toggles, and the moving pill makes it read as a switch rather
 * than two icons.
 *
 * Semantically a `switch`: there are exactly two states and one is "on". That
 * also gives keyboard users Space and Enter for free.
 *
 * The `mounted` gate exists because the active theme is unknown during SSR;
 * rendering the real state before hydration would mismatch. A same-size
 * placeholder is emitted so the header does not shift.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return <div aria-hidden="true" className={cn('h-10 w-18 shrink-0', className)} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      /*
       * Geometry has to be exact or the indicator sits off-centre. Two 32px
       * (size-8) icon slots plus 4px (p-1) either side is 72px - so the track
       * is w-18, and the indicator travels exactly one slot width, 32px. Any
       * other width leaves uneven margins at the two ends.
       */
      className={cn(
        'border-border bg-surface-alt relative flex h-10 w-18 shrink-0 items-center',
        'cursor-pointer rounded-full border p-1',
        className,
      )}
    >
      {/* Sliding indicator. Transform-only, so it animates on the compositor. */}
      <span
        aria-hidden="true"
        className={cn(
          'bg-accent absolute top-1 left-1 size-8 rounded-full shadow-[var(--shadow)]',
          'transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
          'motion-reduce:transition-none',
          isDark && 'translate-x-8',
        )}
      />

      {/* Icons sit above the indicator; the active one inverts against it. */}
      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 flex size-8 items-center justify-center transition-colors duration-200',
          isDark ? 'text-muted' : 'text-accent-contrast',
        )}
      >
        <Sun className="size-4" />
      </span>

      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 flex size-8 items-center justify-center transition-colors duration-200',
          isDark ? 'text-accent-contrast' : 'text-muted',
        )}
      >
        <Moon className="size-4" />
      </span>
    </button>
  );
}
