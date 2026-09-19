'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { whatsappLink } from '@/lib/content/site';

/**
 * Route-level error boundary.
 *
 * Catches render and data errors below the layout, so the header, footer and
 * navigation survive - a visitor who hits an error can still get somewhere
 * useful instead of staring at a blank page.
 *
 * The `digest` is shown deliberately: it is the only identifier that ties what
 * the visitor saw to a line in our server logs, and quoting it turns an
 * unhelpful bug report into an actionable one. It contains no sensitive data.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with a Sentry capture when error reporting is wired up.
    console.error('[route error]', error);
  }, [error]);

  return (
    <div className="container-wr flex min-h-[60dvh] max-w-xl flex-col justify-center py-20">
      <p className="text-accent mb-3 text-[13px] font-bold tracking-[0.12em] uppercase">Error</p>
      <h1 className="mb-4 text-[clamp(28px,3.6vw,40px)]">Something went wrong.</h1>
      <p className="mb-8 text-[17px]">
        That is on us, not you. Try again - and if it keeps happening, message us and we will fix
        it.
      </p>

      <div className="flex flex-wrap gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
        <Button
          href={whatsappLink('Hi WebRectangle! I hit an error on your site.')}
          external
          variant="outline"
        >
          Report it
        </Button>
      </div>

      {error.digest ? (
        <p className="text-muted mt-8 text-[13px]">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
    </div>
  );
}
