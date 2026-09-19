import type { Metadata } from 'next';
import Link from 'next/link';

import { IsometricMark } from '@/components/brand/isometric-mark';
import { Logo } from '@/components/brand/logo';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Glass } from '@/components/ui/glass';
import { StatusBadge } from '@/components/ui/status-badge';
import { site } from '@/lib/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Log In',
  description: 'Sign in to your WebRectangle brand or creator account.',
  path: '/login',
  // Nothing to index on a sign-in screen, and no reason to compete with the
  // real pages for crawl budget.
  noIndex: true,
});

/**
 * Sign-in screen.
 *
 * A visual stub: accounts are not open yet, so the form is disabled and says
 * so rather than pretending to authenticate. The layout, fields and structure
 * are real, so dropping in NextAuth later means wiring the action and removing
 * the notice - not redesigning the page.
 *
 * Showing a working-looking form that silently fails would be worse than
 * showing an honest one.
 */
export default function LoginPage() {
  return (
    <div className="relative grid min-h-[calc(100dvh-76px)] lg:grid-cols-2">
      <BackgroundLayers />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo asLink={false} />
          </div>

          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-[clamp(28px,3.4vw,36px)]">Welcome back</h1>
            <StatusBadge status="building" />
          </div>

          <p className="mb-8 text-[15px]">
            Accounts are not open yet. We are onboarding the first brands and creators by hand -{' '}
            <Link href="/contact" className="text-accent font-semibold hover:underline">
              get in touch
            </Link>{' '}
            and we will set you up.
          </p>

          {/* Intentionally inert. `inert` keeps the whole group out of the tab
              order so keyboard users are not led into a dead form. */}
          <div inert className="mb-6 space-y-4 opacity-55">
            <Field label="Email" htmlFor="login-email">
              <Input id="login-email" type="email" placeholder="you@company.com" disabled />
            </Field>

            <Field label="Password" htmlFor="login-password">
              <Input id="login-password" type="password" placeholder="••••••••" disabled />
            </Field>

            <Button fullWidth disabled>
              Sign in
            </Button>
          </div>

          <Button href="/contact" variant="outline" fullWidth withArrow>
            Request access
          </Button>

          <p className="text-muted mt-6 text-[13.5px]">
            New here?{' '}
            <Link href="/join/brand" className="text-accent font-semibold hover:underline">
              Start a campaign
            </Link>{' '}
            or{' '}
            <Link href="/join/creator" className="text-accent font-semibold hover:underline">
              join as a creator
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-[linear-gradient(140deg,#0A0F1E_0%,#04255A_100%)] lg:flex">
        <Glass tier="dark" className="relative z-10 mx-12 p-10">
          <Logo asLink={false} variant="mono" className="mb-6 text-white" />
          <p className="max-w-sm text-[20px] leading-snug font-semibold text-white">
            {site.tagline}
          </p>
          <p className="mt-3 max-w-sm text-[15px] text-white/70">{site.description}</p>
        </Glass>

        <div aria-hidden="true" className="absolute -right-20 -bottom-24 w-[520px] opacity-25">
          <IsometricMark />
        </div>
      </div>
    </div>
  );
}
