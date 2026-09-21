import { Layers, LineChart, Search, Send, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Eyebrow } from '@/components/brand/eyebrow';
import { IconTile } from '@/components/brand/icon-tile';
import { IsometricMark } from '@/components/brand/isometric-mark';
import { Logo } from '@/components/brand/logo';
import { Avatar } from '@/components/ui/avatar';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckItem } from '@/components/ui/check-item';
import { Chip } from '@/components/ui/chip';
import { Disclosure } from '@/components/ui/disclosure';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Glass } from '@/components/ui/glass';
import { PartnerLogo } from '@/components/ui/partner-logo';
import { Reveal } from '@/components/ui/reveal';
import { SampleDataNotice } from '@/components/ui/sample-data-notice';
import { Highlight, SectionHeading } from '@/components/ui/section-heading';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';

export const metadata: Metadata = {
  title: 'Kitchen sink',
  robots: { index: false, follow: false },
};

/**
 * Development-only component gallery.
 *
 * Every primitive rendered once in light and once in dark, so regressions in
 * the token layer are obvious at a glance without clicking through the whole
 * site. Excluded from production builds via notFound(), and marked noindex.
 */
export default function KitchenSinkPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="container-wr space-y-16 py-16">
      <header>
        <Eyebrow className="mb-4">Internal</Eyebrow>
        <h1 className="text-[clamp(30px,4vw,42px)]">Kitchen sink</h1>
        <p className="mt-3 max-w-xl">
          Development-only gallery of every design-system primitive. Not reachable in production.
        </p>
      </header>

      <Panels />

      <section className="dark bg-surface -mx-6 rounded-[var(--r-card)] px-6 py-12">
        <p className="text-muted mb-8 text-[13px] font-bold tracking-[0.12em] uppercase">
          Dark theme
        </p>
        <Panels />
      </section>
    </main>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">{title}</h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

function Panels() {
  return (
    <div className="space-y-12">
      <Row title="Logo">
        <Logo asLink={false} size="sm" />
        <Logo asLink={false} size="md" />
        <Logo asLink={false} size="lg" />
        <span className="text-ink">
          <Logo asLink={false} variant="mono" />
        </span>
      </Row>

      <Row title="Buttons">
        <Button variant="primary" withArrow>
          Find Creators
        </Button>
        <Button variant="outline" withArrow>
          Join as a Creator
        </Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="lg" withArrow>
          Large
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </Row>

      <div className="from-brand-fill-from to-brand-fill-to flex flex-wrap items-center gap-4 rounded-[var(--r-card)] bg-gradient-to-br p-6">
        <Button variant="white" withArrow>
          On gradient
        </Button>
        <Button variant="ghost" withArrow>
          Ghost
        </Button>
        <Glass tier="dark" className="px-4 py-2 text-[13px] font-semibold text-white">
          Dark glass
        </Glass>
      </div>

      <Row title="Status badges">
        <StatusBadge status="live" />
        <StatusBadge status="beta" />
        <StatusBadge status="building" />
        <SampleDataNotice />
      </Row>

      <SampleDataNotice variant="bar" />

      <Row title="Chips">
        <Chip>Instagram</Chip>
        <Chip selected>Fitness</Chip>
        <Chip>Delhi NCR</Chip>
      </Row>

      <Row title="Icon tiles">
        <IconTile size="sm">
          <Search />
        </IconTile>
        <IconTile>
          <Users />
        </IconTile>
        <IconTile size="lg">
          <Send />
        </IconTile>
        <IconTile variant="soft">
          <LineChart />
        </IconTile>
        <IconTile variant="soft">
          <Sparkles />
        </IconTile>
        <IconTile variant="soft">
          <Layers />
        </IconTile>
      </Row>

      <Row title="Avatars">
        <Avatar name="Riya Fitness" size="sm" />
        <Avatar name="Aarav Builds" />
        <Avatar name="Macro Kitchen" size="lg" />
      </Row>

      <Row title="Partner logos">
        <PartnerLogo logo={{ name: 'MEITY', src: null }} />
        <PartnerLogo logo={{ name: 'Govt of Uttar Pradesh', src: null }} />
      </Row>

      <section className="space-y-4">
        <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">Surfaces</h2>
        <div className="relative grid gap-5 overflow-hidden rounded-[var(--r-card)] p-8 md:grid-cols-3">
          <BackgroundLayers />
          <Card className="p-6">
            <h3 className="text-[19px]">Card</h3>
            <p className="mt-2 text-[14.5px]">Static surface with hairline border.</p>
          </Card>
          <Card interactive className="p-6">
            <h3 className="text-[19px]">Interactive card</h3>
            <p className="mt-2 text-[14.5px]">Lifts 4px on hover.</p>
          </Card>
          <Glass className="p-6">
            <h3 className="text-[19px]">Glass panel</h3>
            <p className="mt-2 text-[14.5px]">Tier 2, over grid and aurora.</p>
          </Glass>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">
          Typography
        </h2>
        <SectionHeading
          eyebrow="Section heading"
          title={
            <>
              Find the right creators. <Highlight>Build better campaigns.</Highlight>
            </>
          }
          description="Supporting copy sits to the right on wide screens, mirroring the legacy two-column section header."
        />
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">
            Checklist
          </h2>
          <ul className="grid gap-4">
            <CheckItem title="Relevance over reach">
              Match on niche, audience and location, not follower count alone.
            </CheckItem>
            <CheckItem title="Structured outreach">
              Every invitation carries the brief, deliverables and timeline.
            </CheckItem>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">
            Disclosure
          </h2>
          <Disclosure question="How does creator discovery work?" name="ks-faq">
            Filter by platform, niche, location, audience and engagement, then shortlist the
            creators that fit your campaign.
          </Disclosure>
          <Disclosure question="What does it cost?" name="ks-faq">
            We are in early access and pricing with our first brands directly.
          </Disclosure>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">Forms</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name" htmlFor="ks-name" required>
            <Input id="ks-name" placeholder="Your name" />
          </Field>
          <Field label="Email" htmlFor="ks-email" required error="Enter a valid email address.">
            <Input id="ks-email" type="email" aria-invalid placeholder="you@company.com" />
          </Field>
          <Field label="I am a" htmlFor="ks-role" hint="Helps us route your message.">
            <Select id="ks-role" defaultValue="brand">
              <option value="brand">Brand</option>
              <option value="creator">Creator</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Message" htmlFor="ks-msg" className="md:col-span-2">
            <Textarea id="ks-msg" placeholder="Tell us about your campaign..." />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">
          Skeletons
        </h2>
        <div className="grid gap-4 md:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-muted text-[12.5px] font-bold tracking-[0.12em] uppercase">
          Brand mark
        </h2>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <Reveal>
            <IsometricMark className="max-w-[360px]" />
          </Reveal>
          <IsometricMark variant="compact" animated={false} className="max-w-[220px]" />
        </div>
      </section>
    </div>
  );
}
