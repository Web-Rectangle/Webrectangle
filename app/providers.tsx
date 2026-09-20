'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';

/**
 * Sonner is only ever needed after a form submission, which is far past
 * hydration. Loading it lazily keeps ~13 KB gzipped out of the chunk that
 * every page - including the 404 - has to download before it can render.
 *
 * Safe against the "toast fires before Toaster mounts" race because nothing
 * toasts on page load; the earliest possible toast follows a user action.
 */
const Toaster = dynamic(() => import('sonner').then((m) => m.Toaster), { ssr: false });

/**
 * Client-side providers.
 *
 * Kept deliberately thin and mounted once in the root layout so the rest of
 * the tree can stay as Server Components.
 *
 * `disableTransitionOnChange` suppresses the colour-transition sweep that
 * would otherwise run across every element when the theme flips.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      // Light is the brand's primary presentation, so it is the default rather
      // than deferring to the OS. `enableSystem={false}` keeps the toggle a
      // genuine two-state control - with system detection on, next-themes
      // resolves an implicit third state that the UI would not be showing.
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="wr-theme"
    >
      {children}
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: 'var(--r-card)',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </ThemeProvider>
  );
}
