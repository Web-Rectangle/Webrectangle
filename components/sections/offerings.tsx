import { Check, Link2, Search, Users } from 'lucide-react';

import { IconTile } from '@/components/brand/icon-tile';
import { Glass } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { StatusBadge } from '@/components/ui/status-badge';
import { type Offering, offerings } from '@/lib/content/home';

const ICONS: Record<Offering['icon'], React.ReactNode> = {
  search: <Search />,
  users: <Users />,
  link: <Link2 />,
};

/**
 * The three things we sell.
 *
 * Link tracking carries a "Building" badge rather than being quietly listed
 * alongside the two live services. Selling something that does not exist yet
 * is the fastest way to lose a first customer at the point they try to use it;
 * naming it as in-development still signals where the product is going.
 */
export function Offerings() {
  return (
    <section className="section-y defer-paint bg-surface-alt" id="offerings">
      <div className="container-wr">
        <SectionHeading
          eyebrow={offerings.eyebrow}
          title={offerings.title}
          description={offerings.description}
          align="center"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {offerings.items.map((offering, i) => (
            <Reveal key={offering.title} delay={i * 0.08}>
              <Glass className="flex h-full flex-col p-7">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <IconTile variant={offering.status === 'live' ? 'gradient' : 'soft'}>
                    {ICONS[offering.icon]}
                  </IconTile>
                  {offering.status === 'building' ? <StatusBadge status="building" /> : null}
                </div>

                <h3 className="mb-1.5 text-[21px]">{offering.title}</h3>
                <p className="text-accent mb-3 text-[14px] font-semibold">{offering.tagline}</p>
                <p className="mb-6 text-[14.5px]">{offering.body}</p>

                <ul className="mt-auto grid gap-2.5">
                  {offering.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="bg-accent text-accent-contrast mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full"
                      >
                        <Check className="size-2.5" strokeWidth={3.5} />
                      </span>
                      <span className="text-[13.5px]">{point}</span>
                    </li>
                  ))}
                </ul>
              </Glass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
