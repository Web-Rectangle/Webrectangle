import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type FirebaseStorage, getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAdZZP6alOVXuGIRbllyq7gjs5tp14VVaU',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'webrectangle.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'webrectangle',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'webrectangle.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '928379906869',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:928379906869:web:aac180185e624236be7a7c',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-538KJKLV2Q',
};

/**
 * Initializes or returns the singleton Firebase App instance.
 * Safe across Next.js SSR, RSC, and Fast Refresh cycles.
 */
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

/**
 * Returns Firebase Auth instance.
 */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/**
 * Returns Firebase Storage instance.
 */
export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

let analyticsInstance: import('firebase/analytics').Analytics | null = null;
let analyticsPromise: Promise<import('firebase/analytics').Analytics | null> | null = null;

/**
 * Safely initializes Firebase Analytics in browser environments where supported.
 * Returns null during SSR or if the environment (e.g., IndexedDB disabled) does not support it.
 */
export async function getFirebaseAnalytics(): Promise<
  import('firebase/analytics').Analytics | null
> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (analyticsInstance) {
    return analyticsInstance;
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      try {
        const { getAnalytics, isSupported } = await import('firebase/analytics');
        const supported = await isSupported();
        if (!supported) {
          return null;
        }
        const app = getFirebaseApp();
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      } catch (err) {
        console.warn('Firebase Analytics initialization skipped:', err);
        return null;
      }
    })();
  }

  return analyticsPromise;
}

/**
 * Helper to log custom events to Firebase Analytics in a safe, non-throwing manner.
 */
export async function logFirebaseEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean | null | undefined>,
): Promise<void> {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      const { logEvent } = await import('firebase/analytics');
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.warn(`Failed to log Firebase event "${eventName}":`, err);
  }
}

export const app = getFirebaseApp();
