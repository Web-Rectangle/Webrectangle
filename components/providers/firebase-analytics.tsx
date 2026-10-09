'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { getFirebaseAnalytics, logFirebaseEvent } from '@/lib/firebase/client';

/**
 * Initializes Firebase Analytics and automatically logs page view events
 * on route changes in client-side App Router navigation.
 */
export function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    void getFirebaseAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) {
      void logFirebaseEvent('page_view', {
        page_path: pathname,
        page_title: typeof document !== 'undefined' ? document.title : '',
      });
    }
  }, [pathname]);

  return null;
}
