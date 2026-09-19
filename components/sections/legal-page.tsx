import { PageHero } from '@/components/sections/page-hero';
import { LAST_UPDATED, type LegalSection } from '@/lib/content/legal';

/**
 * Shared layout for the privacy policy and terms.
 *
 * Constrained to a comfortable reading measure and left at a normal body size.
 * Legal text set small and grey signals "do not read this", which is precisely
 * the wrong signal for a page whose whole job is to be understood.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="pb-20">
        <div className="container-wr max-w-[720px]">
          <p className="text-muted border-border mb-10 border-b pb-6 text-[13.5px] font-semibold">
            Last updated {LAST_UPDATED}
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-3 text-[21px]">{section.heading}</h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="text-[15.5px] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
