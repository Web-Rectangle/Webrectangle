import { IsometricMark } from '@/components/brand/isometric-mark';
import { CheckItem } from '@/components/ui/check-item';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { why } from '@/lib/content/home';

/**
 * Differentiation, kept to three points.
 *
 * The legacy site had six generic reassurances here ("Strategy First", "Fast
 * Delivery"). Those are table stakes that every agency claims, so they proved
 * nothing. These three are positions a competitor could genuinely disagree
 * with, which is what makes them worth stating.
 */
export function WhyWebRectangle() {
  return (
    <section className="section-y defer-paint">
      <div className="container-wr grid items-center gap-16 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <SectionHeading eyebrow={why.eyebrow} title={why.title} className="mb-8" />

          <ul className="grid gap-5">
            {why.points.map((point, i) => (
              <Reveal as="li" key={point.title} delay={i * 0.08}>
                <ul>
                  <CheckItem title={point.title}>{point.body}</CheckItem>
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal from="right" className="hidden justify-self-center lg:block">
          <IsometricMark variant="compact" className="max-w-[320px]" />
        </Reveal>
      </div>
    </section>
  );
}
