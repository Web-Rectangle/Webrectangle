import { Layers, LineChart, Search, Send } from 'lucide-react';

import { IconTile } from '@/components/brand/icon-tile';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Glass } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { StatusBadge } from '@/components/ui/status-badge';
import { solution, type SolutionPillar } from '@/lib/content/home';

const ICONS: Record<SolutionPillar['icon'], React.ReactNode> = {
  search: <Search />,
  send: <Send />,
  layers: <Layers />,
  chart: <LineChart />,
};

/**
 * The four connected stages of the platform.
 *
 * Every pillar carries a StatusBadge. Two are in beta and two are still being
 * built, and saying so plainly is the point - it makes the two that do work
 * more believable than four uniform claims would.
 */
export function Solution() {
  return (
    <section className="section-y defer-paint bg-surface-alt relative overflow-hidden">
      <BackgroundLayers grid={false} />

      <div className="container-wr">
        <SectionHeading
          eyebrow={solution.eyebrow}
          title={solution.title}
          description={solution.description}
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {solution.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.07}>
              <Glass className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <IconTile variant={i < 2 ? 'gradient' : 'soft'}>{ICONS[pillar.icon]}</IconTile>
                  <StatusBadge status={pillar.status} />
                </div>

                <div>
                  <h3 className="mb-1.5 text-[18px]">{pillar.title}</h3>
                  <p className="text-[14.5px]">{pillar.outcome}</p>
                </div>
              </Glass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
