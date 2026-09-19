'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

/**
 * Client-side providers.
 *
 * Kept deliberately thin and mounted once in the root layout so that the rest
 * of the tree can stay as Server Components.
 *
 * `disableTransitionOnChange` suppresses the colour-transition flash that
 * otherwise sweeps every element when the theme flips.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
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
