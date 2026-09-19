import { PartnerLogo } from '@/components/ui/partner-logo';
import { partnerLogos, partnerLogosHeading } from '@/lib/content/proof';

/**
 * Logos of organisations the team has genuinely worked with.
 *
 * Note what this section does NOT say: no count, no "trusted by N brands", no
 * client names we cannot evidence. The heading is deliberately modest because
 * the honest claim is modest. See lib/content/proof.ts for the allowlist and
 * the reasoning.
 */
export function WorkedWith() {
  return (
    <section className="border-border bg-surface-alt border-y py-9">
      <div className="container-wr flex flex-col items-center gap-7">
        <h2 className="text-muted text-[12px] font-bold tracking-[0.12em] uppercase">
          {partnerLogosHeading}
        </h2>

        <ul className="flex flex-wrap items-center justify-center gap-x-11 gap-y-6">
          {partnerLogos.map((logo) => (
            <li key={logo.name}>
              <PartnerLogo logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
