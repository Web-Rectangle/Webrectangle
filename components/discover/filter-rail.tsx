'use client';

import { X } from 'lucide-react';

import { Chip } from '@/components/ui/chip';
import {
  CATEGORIES,
  CONTENT_TYPES,
  type CreatorFilters,
  PLATFORMS,
  TIERS,
} from '@/lib/schemas/creator';
import { formatCount, humanise } from '@/lib/utils/format';

/**
 * Follower bands offered in the rail.
 *
 * Presented as named bands rather than a numeric slider: brands brief in
 * rough tiers ("micro creators"), and a two-handle range slider is fiddly on
 * touch and hostile to keyboards. The underlying filter is still numeric.
 */
const FOLLOWER_BANDS = [
  { id: 'nano', label: 'Under 10K', min: 0, max: 10_000 },
  { id: 'micro', label: '10K - 100K', min: 10_000, max: 100_000 },
  { id: 'mid', label: '100K - 500K', min: 100_000, max: 500_000 },
  { id: 'macro', label: '500K+', min: 500_000, max: undefined },
] as const;

const ENGAGEMENT_STEPS = [2, 4, 6] as const;

export type FilterPatch = Partial<CreatorFilters>;

/**
 * Faceted filter rail for creator discovery.
 *
 * Every control is a real button or checkbox with proper pressed state, so the
 * whole rail is operable from the keyboard and announced correctly. Facet
 * counts come from the full dataset rather than the current result set, so
 * option labels do not all collapse to zero as a search narrows.
 */
export function FilterRail({
  filters,
  facets,
  cities,
  onChange,
  onReset,
}: {
  filters: CreatorFilters;
  facets: Record<string, Record<string, number>>;
  cities: readonly string[];
  onChange: (patch: FilterPatch) => void;
  onReset: () => void;
}) {
  const toggleIn = <T extends string>(current: readonly T[] | undefined, value: T): T[] => {
    const set = new Set(current ?? []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    return [...set];
  };

  const activeCount =
    (filters.platforms?.length ?? 0) +
    (filters.categories?.length ?? 0) +
    (filters.cities?.length ?? 0) +
    (filters.tiers?.length ?? 0) +
    (filters.contentTypes?.length ?? 0) +
    (filters.minFollowers !== undefined || filters.maxFollowers !== undefined ? 1 : 0) +
    (filters.minEngagement !== undefined ? 1 : 0);

  const activeBand = FOLLOWER_BANDS.find(
    (b) => b.min === filters.minFollowers && b.max === filters.maxFollowers,
  );

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-ink text-[15px] font-bold">Filters</h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="text-muted hover:text-accent flex items-center gap-1 text-[13px] font-semibold transition-colors"
          >
            <X aria-hidden="true" className="size-3.5" />
            Clear {activeCount}
          </button>
        ) : null}
      </div>

      <Group label="Platform">
        {PLATFORMS.map((p) => (
          <Chip
            key={p}
            selected={filters.platforms?.includes(p) ?? false}
            onToggle={() => onChange({ platforms: toggleIn(filters.platforms, p) })}
          >
            {humanise(p)}
            <Count n={facets.platforms?.[p]} />
          </Chip>
        ))}
      </Group>

      <Group label="Category">
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            selected={filters.categories?.includes(c) ?? false}
            onToggle={() => onChange({ categories: toggleIn(filters.categories, c) })}
          >
            {humanise(c)}
            <Count n={facets.categories?.[c]} />
          </Chip>
        ))}
      </Group>

      <Group label="Location">
        {cities.map((city) => (
          <Chip
            key={city}
            selected={filters.cities?.includes(city) ?? false}
            onToggle={() => onChange({ cities: toggleIn(filters.cities, city) })}
          >
            {city}
            <Count n={facets.cities?.[city]} />
          </Chip>
        ))}
      </Group>

      <Group label="Followers">
        {FOLLOWER_BANDS.map((band) => {
          const selected = activeBand?.id === band.id;
          return (
            <Chip
              key={band.id}
              selected={selected}
              onToggle={() =>
                onChange(
                  selected
                    ? { minFollowers: undefined, maxFollowers: undefined }
                    : { minFollowers: band.min, maxFollowers: band.max },
                )
              }
            >
              {band.label}
            </Chip>
          );
        })}
      </Group>

      <Group label="Minimum engagement">
        {ENGAGEMENT_STEPS.map((step) => {
          const selected = filters.minEngagement === step;
          return (
            <Chip
              key={step}
              selected={selected}
              onToggle={() => onChange({ minEngagement: selected ? undefined : step })}
            >
              {step}%+
            </Chip>
          );
        })}
      </Group>

      <Group label="Creator size">
        {TIERS.map((t) => (
          <Chip
            key={t}
            selected={filters.tiers?.includes(t) ?? false}
            onToggle={() => onChange({ tiers: toggleIn(filters.tiers, t) })}
          >
            {humanise(t)}
            <Count n={facets.tiers?.[t]} />
          </Chip>
        ))}
      </Group>

      <Group label="Content type">
        {CONTENT_TYPES.map((t) => (
          <Chip
            key={t}
            selected={filters.contentTypes?.includes(t) ?? false}
            onToggle={() => onChange({ contentTypes: toggleIn(filters.contentTypes, t) })}
          >
            {humanise(t)}
          </Chip>
        ))}
      </Group>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-muted mb-2.5 text-[11.5px] font-bold tracking-[0.1em] uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Count({ n }: { n: number | undefined }) {
  if (!n) return null;
  return <span className="ml-0.5 opacity-55">{formatCount(n)}</span>;
}
