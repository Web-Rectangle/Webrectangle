import { WhatsAppIcon } from '@/components/ui/social-icons';
import { whatsappLink } from '@/lib/content/site';

/**
 * Floating WhatsApp button.
 *
 * Carried over from the legacy site, pulse ring and all. It stays because
 * WhatsApp is the default business channel for Indian SMBs and D2C founders -
 * for a large share of our audience it converts better than a form, and it
 * costs nothing to keep open.
 *
 * Offset above the mobile CTA bar so the two never overlap on small screens.
 */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi WebRectangle! I'd like to know more about the platform.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with WebRectangle on WhatsApp"
      className="bg-whatsapp fixed right-5 bottom-24 z-[55] flex size-14 items-center justify-center rounded-full shadow-[0_8px_24px_rgb(37_211_102_/_0.45)] transition-transform duration-250 hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 md:right-6 md:bottom-6"
    >
      <span
        aria-hidden="true"
        className="border-whatsapp absolute inset-0 rounded-full border-2 motion-safe:animate-[wa-pulse_2s_ease-out_infinite]"
      />
      <WhatsAppIcon className="relative size-7 text-white" />
    </a>
  );
}
