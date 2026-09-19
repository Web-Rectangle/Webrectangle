import Image from 'next/image';

import { cn } from '@/lib/utils/cn';

export type PartnerLogoData = {
  name: string;
  /** Path under /public. When null, the wordmark placeholder is rendered instead. */
  src: string | null;
  width?: number;
  height?: number;
};

/**
 * Logo of an organisation we have genuinely worked with.
 *
 * WHY THE PLACEHOLDER PATH EXISTS: the four real logo files
 * (MEITY, UP Government, MyBigGuide, PC School) were referenced by the legacy
 * site but are not committed to this repository. Rather than ship a broken
 * image or - worse - substitute an invented brand, an absent file degrades to
 * a neutral wordmark. Drop the real assets into /public/logos (see the README
 * there) and set `src` in lib/content/proof.ts to swap them in.
 *
 * Greyscale at rest, full colour on hover, matching the legacy treatment.
 */
export function PartnerLogo({ logo, className }: { logo: PartnerLogoData; className?: string }) {
  if (!logo.src) {
    return (
      <span
        className={cn(
          'border-border text-muted inline-flex items-center rounded-[8px] border border-dashed',
          'px-4 py-2.5 text-[15px] font-bold tracking-[-0.01em]',
          className,
        )}
      >
        {logo.name}
      </span>
    );
  }

  return (
    <Image
      src={logo.src}
      alt={logo.name}
      width={logo.width ?? 140}
      height={logo.height ?? 40}
      className={cn(
        'h-10 w-auto object-contain opacity-70 grayscale',
        'transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0',
        className,
      )}
    />
  );
}
