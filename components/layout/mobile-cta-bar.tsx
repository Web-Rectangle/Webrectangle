'use client';

import { Button } from '@/components/ui/button';
import { useScrolledFraction } from '@/lib/hooks/use-client-state';
import { cn } from '@/lib/utils/cn';

/**
 * Sticky dual call-to-action bar for small screens.
 *
 * Appears once the visitor is 40% down the page - far enough in to have read
 * the pitch, early enough to still act on it. Showing it immediately would
 * cover content before anyone has a reason to convert.
 *
 * Both audiences get a button, because the site serves brands and creators
 * equally and picking one primary action on mobile would quietly deprioritise
 * half the visitors.
 *
 * Enter/exit is a CSS transition rather than AnimatePresence so the root
 * layout stays free of an animation library - see ScrollProgress for the same
 * reasoning. The bar stays mounted and is moved off-screen, which also keeps
 * it out of the tab order via `inert` when hidden.
 */
export function MobileCtaBar() {
  const visible = useScrolledFraction(0.4);

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        'glass-md glass-readable fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-[var(--r-glass)] p-2 md:hidden',
        'transition-[transform,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
        'motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[120%] opacity-0',
      )}
    >
      {/* Wording matches the hero and the Get in touch section. Sending a
          brand to /discover instead would drop them onto sample data rather
          than a way to reach us. */}
      <Button href="/join/brand" size="sm" fullWidth className="min-h-11">
        I am a brand
      </Button>
      <Button href="/join/creator" size="sm" variant="outline" fullWidth className="min-h-11">
        I am a creator
      </Button>
    </div>
  );
}
