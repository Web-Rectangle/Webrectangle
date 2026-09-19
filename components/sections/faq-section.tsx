import { Disclosure } from '@/components/ui/disclosure';
import { SectionHeading } from '@/components/ui/section-heading';
import { faq } from '@/lib/content/home';

/**
 * Frequently asked questions.
 *
 * Seven items, each answering something a real prospect would actually ask -
 * including the two most people dodge: what it costs, and what happens to
 * their data. Answering those plainly builds more trust than another feature
 * paragraph would.
 *
 * Grouped under a shared `name` so the native exclusive-disclosure behaviour
 * keeps only one open at a time.
 */
export function FaqSection() {
  return (
    <section className="section-y defer-paint" id="faq">
      <div className="container-wr">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} align="center" />

        <div className="mx-auto max-w-[760px]">
          {faq.items.map((item) => (
            <Disclosure key={item.q} question={item.q} name="home-faq">
              {item.a}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
