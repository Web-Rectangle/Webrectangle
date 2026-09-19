import { Sparkles } from 'lucide-react';

import { IconTile } from '@/components/brand/icon-tile';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { StatusBadge } from '@/components/ui/status-badge';
import { ai } from '@/lib/content/home';

/**
 * AI capabilities, stated honestly.
 *
 * Every item here is marked "Building", because none of it ships yet. The
 * alternative - implying these work, or omitting the roadmap entirely - would
 * either mislead visitors or hide the most interesting thing about where the
 * product is going. A labelled roadmap does neither.
 *
 * Language is also deliberate on quality signals: "flag patterns worth a closer
 * look", never "detects fake followers". No available data source supports the
 * stronger claim.
 */
export function AiCapabilities() {
  return (
    <section className="section-y defer-paint bg-surface-alt">
      <div className="container-wr">
        <SectionHeading
          eyebrow={ai.eyebrow}
          title={ai.title}
          description={ai.description}
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {ai.capabilities.map((capability, i) => (
            <Reveal key={capability.title} delay={i * 0.07}>
              <Card className="flex h-full items-start gap-4 p-6">
                <IconTile variant="soft" size="sm">
                  <Sparkles />
                </IconTile>

                <div>
                  <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                    <h3 className="text-[17px]">{capability.title}</h3>
                    <StatusBadge status={capability.status} />
                  </div>
                  <p className="text-[14.5px]">{capability.body}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <p className="text-ink mt-10 text-center text-[19px] font-bold">{ai.principle}</p>
      </div>
    </section>
  );
}
