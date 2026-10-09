import { logFirebaseEvent } from '@/lib/firebase/client';

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Dispatches an analytics event across configured tracking providers (Firebase Analytics & Plausible).
 * Browser-safe and non-blocking for user interactions.
 */
export async function track(eventName: string, properties?: AnalyticsEventParams): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  // 1. Firebase Analytics (GA4)
  try {
    await logFirebaseEvent(eventName, properties);
  } catch (err) {
    console.warn(`[analytics] Firebase tracking failed for "${eventName}":`, err);
  }

  // 2. Plausible custom events (if available on window)
  try {
    const win = window as unknown as {
      plausible?: (event: string, options?: { props?: AnalyticsEventParams }) => void;
    };
    if (typeof win.plausible === 'function') {
      win.plausible(eventName, { props: properties });
    }
  } catch (err) {
    console.warn(`[analytics] Plausible tracking failed for "${eventName}":`, err);
  }
}
