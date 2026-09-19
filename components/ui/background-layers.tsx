import { cn } from '@/lib/utils/cn';

/**
 * Decorative backdrop: the 44px brand grid plus slow aurora blooms.
 *
 * Glass only reads as a material when there is something behind it to refract,
 * so any section containing glass panels should render this first. Absolutely
 * positioned and `pointer-events-none`, so it never interferes with layout or
 * interaction; the parent needs `relative` and usually `overflow-hidden`.
 */
export function BackgroundLayers({
  grid = true,
  aurora = true,
  fade = 'radial',
  className,
}: {
  grid?: boolean;
  aurora?: boolean;
  /** `radial` for hero-style centre focus, `y` for mid-page sections. */
  fade?: 'radial' | 'y';
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      {grid ? <div className={cn('bg-grid', fade === 'y' && 'bg-grid-fade-y')} /> : null}
      {aurora ? <div className="bg-aurora" /> : null}
    </div>
  );
}
