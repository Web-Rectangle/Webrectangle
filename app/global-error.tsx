'use client';

/**
 * Last-resort error boundary.
 *
 * Only fires when the root layout itself fails, which means neither the theme
 * provider nor the stylesheet can be relied upon. It therefore renders its own
 * <html> and <body> and uses inline styles rather than Tailwind classes - a
 * class that never loaded would leave an unreadable page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          color: '#5A6472',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#0A0F1E' }}>Web</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#FFFFFF',
                background: '#0165FB',
                borderRadius: 8,
                padding: '3px 10px 4px',
                marginLeft: 4,
              }}
            >
              Rectangle
            </span>
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#0A0F1E',
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Something went badly wrong.
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.6, margin: '0 0 28px' }}>
            The page failed to load entirely. Reloading usually fixes it.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              background: '#0165FB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              padding: '14px 26px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>

          {error.digest ? (
            <p style={{ fontSize: 13, marginTop: 28 }}>Reference: {error.digest}</p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
