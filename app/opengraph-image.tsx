import { ImageResponse } from 'next/og';

// The edge runtime is deprecated in Next 16; next/og runs on Node without it.
export const alt = 'WebRectangle - influencer marketing platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default social share card.
 *
 * Rendered at request time by next/og rather than maintained as a static PNG,
 * so the wordmark and tagline can never drift out of sync with the brand.
 *
 * Note the deliberately plain styling: next/og uses Satori, which supports
 * only a subset of CSS. No gradients on text, no backdrop-filter, and flex
 * layout throughout - which is also why the brand lockup is rebuilt here from
 * primitives rather than reusing the React component.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #E8F1FF 100%)',
        padding: '72px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Brand lockup: "Web" in ink, "Rectangle" reversed out of brand blue. */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.02em' }}>
          Web
        </span>
        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#FFFFFF',
            background: '#0165FB',
            borderRadius: 14,
            padding: '6px 20px 10px',
            marginLeft: 8,
            letterSpacing: '-0.02em',
          }}
        >
          Rectangle
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#0A0F1E',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}
        >
          Find the right creators. Build better campaigns.
        </div>
        <div style={{ fontSize: 28, color: '#5A6472', marginTop: 24, maxWidth: 820 }}>
          Discover relevant creators, manage collaborations and measure campaign performance.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#0165FB' }} />
        <span style={{ fontSize: 24, color: '#5A6472', fontWeight: 600 }}>
          Influencer marketing platform
        </span>
      </div>
    </div>,
    size,
  );
}
