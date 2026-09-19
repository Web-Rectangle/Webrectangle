import './globals.css';

import type { Metadata, Viewport } from 'next';

import { CommandPalette } from '@/components/layout/command-palette';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MobileCtaBar } from '@/components/layout/mobile-cta-bar';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { SkipLink } from '@/components/layout/skip-link';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { site } from '@/lib/content/site';
import { env } from '@/lib/env';
import { inter } from '@/lib/fonts';

import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${site.name} | Influencer Marketing Platform`,
    // Page titles read as "Discover Creators | WebRectangle".
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'influencer marketing platform',
    'influencer discovery',
    'find influencers India',
    'creator discovery',
    'influencer campaign management',
    'influencer outreach',
    'brand creator collaboration',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} | Influencer Marketing Platform`,
    description: site.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Influencer Marketing Platform`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#080C16' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is required by next-themes: it writes the theme
    // class onto <html> before React hydrates, which is intentional and is what
    // prevents a flash of the wrong theme.
    <html lang="en-IN" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <SkipLink />
          <ScrollProgress />
          <Header />

          {/* The skip link and in-page anchors both target #main. */}
          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />
          <WhatsAppFab />
          <MobileCtaBar />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
