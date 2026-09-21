import { CommandPalette } from '@/components/layout/command-palette';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MobileCtaBar } from '@/components/layout/mobile-cta-bar';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';

/**
 * Public-facing site chrome.
 *
 * Extracted out of the root layout so it is opt-in per section rather than
 * inherited by everything. It previously lived in the root layout, which meant
 * /admin rendered the marketing header on top of its own - two logos, plus a
 * footer, a WhatsApp button and a "I am a brand / I am a creator" bar over an
 * internal review queue.
 *
 * Used by the (marketing) route group and by the 404, which is public and
 * should let someone navigate onward.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
