import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Closing call to action.
 *
 * The legacy brand gradient, carried over intact: 120deg brand-to-deep-blue
 * with a 40px white grid overlay at 5% opacity. One per page, immediately
 * before the footer.
 */
export function CtaBand({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="from-brand-500 to-brand-700 relative overflow-hidden bg-gradient-to-br py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255_/_0.05)_1px,transparent_1px)] bg-[length:40px_40px]"
      />

      <div className="container-wr relative flex flex-wrap items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <span
            aria-hidden="true"
            className="hidden size-16 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 sm:flex"
          >
            <Send className="size-7 text-white" />
          </span>

          <div>
            <h2 className="text-[clamp(26px,3.4vw,36px)] text-white">{title}</h2>
            <p className="mt-1.5 text-white/85">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button href={primary.href} variant="white" withArrow>
            {primary.label}
          </Button>
          <Button href={secondary.href} variant="ghost">
            {secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
