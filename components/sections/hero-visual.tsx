import { IsometricMark } from '@/components/brand/isometric-mark';

/**
 * Atmospheric backdrop behind the hero demo panel.
 *
 * Renders the static isometric mark by default. The WebGL scene is layered in
 * on top by components/three/hero-scene-gate, which decides at runtime whether
 * this machine should get 3D at all.
 *
 * Deliberately `aria-hidden` and non-interactive: it carries no information,
 * so losing it costs a visitor nothing.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden items-center justify-center lg:flex"
    >
      <IsometricMark className="max-w-[560px] opacity-[0.55]" />
    </div>
  );
}
