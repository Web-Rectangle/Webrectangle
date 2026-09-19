import { cn } from '@/lib/utils/cn';

type IsometricMarkProps = {
  className?: string;
  /** `full` is the hero composition; `compact` is a three-cube cluster for smaller slots. */
  variant?: 'full' | 'compact';
  /** Adds the legacy 6s bob. Disable where the parent already animates. */
  animated?: boolean;
};

/**
 * The isometric cube composition inherited from the legacy hero, re-coloured
 * to the new brand ramp.
 *
 * This is the "Rectangle" in our name made visual, and it does double duty: it
 * is the brand illustration on 2D surfaces, and it is the static fallback
 * rendered whenever the WebGL hero is gated off (reduced motion, no WebGL2,
 * small viewports, save-data, low memory). It therefore has to look
 * deliberate on its own, not like a broken placeholder.
 *
 * Note on gradient IDs: every instance emits identical <defs>, so duplicate
 * IDs across instances resolve to the same gradients and are harmless. This
 * avoids needing useId() and keeps the component renderable on the server.
 */
export function IsometricMark({
  className,
  variant = 'full',
  animated = true,
}: IsometricMarkProps) {
  return (
    <svg
      viewBox={variant === 'full' ? '0 0 520 470' : '0 0 300 280'}
      className={cn(
        'h-auto w-full [filter:drop-shadow(0_24px_40px_rgb(1_101_251_/_0.18))]',
        animated && 'animate-floaty motion-reduce:animate-none',
        className,
      )}
      role="img"
      aria-label="Isometric arrangement of blue and white rectangular blocks representing the WebRectangle brand"
    >
      <defs>
        <linearGradient id="wr-iso-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4D8CFF" />
          <stop offset="1" stopColor="#0165FB" />
        </linearGradient>
        <linearGradient id="wr-iso-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0165FB" />
          <stop offset="1" stopColor="#0142A6" />
        </linearGradient>
        <linearGradient id="wr-iso-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0153D1" />
          <stop offset="1" stopColor="#01337E" />
        </linearGradient>
        <linearGradient id="wr-iso-wtop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDF1F8" />
        </linearGradient>
        <linearGradient id="wr-iso-wleft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F5FA" />
          <stop offset="1" stopColor="#DDE4EF" />
        </linearGradient>
        <linearGradient id="wr-iso-wright" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E4E9F2" />
          <stop offset="1" stopColor="#CBD4E4" />
        </linearGradient>
      </defs>

      {variant === 'full' ? (
        <>
          {/* Primary block, with the lockup skewed onto its left face. */}
          <g>
            <polygon points="260,58 420,150 260,242 100,150" fill="url(#wr-iso-top)" />
            <polygon points="100,150 260,242 260,392 100,300" fill="url(#wr-iso-left)" />
            <polygon points="420,150 260,242 260,392 420,300" fill="url(#wr-iso-right)" />
            <g transform="translate(128,266) skewY(30) scale(.86,1)" aria-hidden="true">
              <text
                x="0"
                y="0"
                fontFamily="Inter, sans-serif"
                fontWeight="800"
                fontSize="26"
                fill="#fff"
              >
                Web
              </text>
              <rect x="54" y="-21" width="118" height="30" rx="7" fill="#fff" />
              <text
                x="61"
                y="1"
                fontFamily="Inter, sans-serif"
                fontWeight="800"
                fontSize="21"
                fill="#0165FB"
              >
                Rectangle
              </text>
            </g>
          </g>

          <g>
            <polygon points="150,20 230,66 150,112 70,66" fill="url(#wr-iso-wtop)" />
            <polygon points="70,66 150,112 150,186 70,140" fill="url(#wr-iso-wleft)" />
            <polygon points="230,66 150,112 150,186 230,140" fill="url(#wr-iso-wright)" />
          </g>
          <g>
            <polygon points="392,6 452,40 392,74 332,40" fill="url(#wr-iso-top)" />
            <polygon points="332,40 392,74 392,128 332,94" fill="url(#wr-iso-left)" />
            <polygon points="452,40 392,74 392,128 452,94" fill="url(#wr-iso-right)" />
          </g>
          <g>
            <polygon points="88,300 168,346 88,392 8,346" fill="url(#wr-iso-wtop)" />
            <polygon points="8,346 88,392 88,458 8,412" fill="url(#wr-iso-wleft)" />
            <polygon points="168,346 88,392 88,458 168,412" fill="url(#wr-iso-wright)" />
          </g>
          <g>
            <polygon points="452,220 512,254 452,288 392,254" fill="url(#wr-iso-wtop)" />
            <polygon points="392,254 452,288 452,342 392,308" fill="url(#wr-iso-wleft)" />
            <polygon points="512,254 452,288 452,342 512,308" fill="url(#wr-iso-wright)" />
          </g>
          <g>
            <polygon points="330,380 378,407 330,434 282,407" fill="url(#wr-iso-top)" />
            <polygon points="282,407 330,434 330,468 282,441" fill="url(#wr-iso-left)" />
            <polygon points="378,407 330,434 330,468 378,441" fill="url(#wr-iso-right)" />
          </g>
        </>
      ) : (
        <>
          <g>
            <polygon points="150,40 240,92 150,144 60,92" fill="url(#wr-iso-top)" />
            <polygon points="60,92 150,144 150,236 60,184" fill="url(#wr-iso-left)" />
            <polygon points="240,92 150,144 150,236 240,184" fill="url(#wr-iso-right)" />
          </g>
          <g>
            <polygon points="90,10 140,38 90,66 40,38" fill="url(#wr-iso-wtop)" />
            <polygon points="40,38 90,66 90,110 40,82" fill="url(#wr-iso-wleft)" />
            <polygon points="140,38 90,66 90,110 140,82" fill="url(#wr-iso-wright)" />
          </g>
          <g>
            <polygon points="240,190 288,217 240,244 192,217" fill="url(#wr-iso-wtop)" />
            <polygon points="192,217 240,244 240,278 192,251" fill="url(#wr-iso-wleft)" />
            <polygon points="288,217 240,244 240,278 288,251" fill="url(#wr-iso-wright)" />
          </g>
        </>
      )}
    </svg>
  );
}
