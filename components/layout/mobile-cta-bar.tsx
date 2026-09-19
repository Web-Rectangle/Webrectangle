'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Sticky dual CTA bar for small screens.
 *
 * Appears once the visitor is 40% down the page - far enough in to have read
 * the pitch, early enough to still act on it. Showing it immediately would
 * cover content before anyone has a reason to convert.
 *
 * Both audiences get a button because the site serves brands and creators
 * equally, and forcing one primary action on mobile would quietly deprioritise
 * half the visitors.
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // Guard against very short pages, where any scroll is ~100%.
      if (scrollable < 600) return;
      setVisible(window.scrollY / scrollable > 0.4);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduced ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="glass-md glass-readable fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-[var(--r-glass)] p-2 md:hidden"
        >
          <Button href="/discover" size="sm" fullWidth>
            Find Creators
          </Button>
          <Button href="/join/creator" size="sm" variant="outline" fullWidth>
            Join as Creator
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
