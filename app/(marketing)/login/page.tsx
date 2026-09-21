import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { IsometricMark } from '@/components/brand/isometric-mark';
import { Logo } from '@/components/brand/logo';
import { AdminLoginForm } from '@/components/forms/admin-login-form';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { Glass } from '@/components/ui/glass';
import { StatusBadge } from '@/components/ui/status-badge';
import { adminLoginAvailable, isAdmin, usingDevPassword } from '@/lib/auth/admin';
import { site } from '@/lib/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Log In',
  description: 'Sign in to WebRectangle.',
  path: '/login',
  // Nothing to index on a sign-in screen, and no reason to spend crawl budget
  // on it.
  noIndex: true,
});

/**
 * Sign-in.
 *
 * Two audiences on one screen. Brand and creator accounts do not exist yet, so
 * that half is an honest notice rather than a form that would silently fail.
 * The admin login beside it is real and is the entry point to the review
 * queue.
 */
export default async function LoginPage() {
  // Already signed in - skip the form rather than making an admin log in twice.
  if (await isAdmin()) redirect('/admin');

  return (
    <div className="relative grid min-h-[calc(100dvh-76px)] lg:grid-cols-2">
      <BackgroundLayers />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo asLink={false} />
          </div>

          <h1 className="mb-2 text-[clamp(28px,3.4vw,36px)]">Sign in</h1>
          <p className="mb-8 text-[15px]">
            Admin access to the submissions queue. Brand and creator accounts are not open yet.
          </p>

          {adminLoginAvailable() ? (
            <AdminLoginForm usingDevPassword={usingDevPassword()} />
          ) : (
            <p className="bg-warning-soft text-warning rounded-[var(--r-btn)] px-4 py-3 text-[14px] font-medium">
              Admin sign-in is not configured on this deployment. Set{' '}
              <code className="font-mono">ADMIN_PASSWORD</code> to enable it.
            </p>
          )}

          <div className="border-border mt-10 border-t pt-8">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-[17px]">Brand and creator accounts</h2>
              <StatusBadge status="building" />
            </div>
            <p className="mb-5 text-[14.5px]">
              We are onboarding the first brands and creators by hand while the product is built.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button href="/join/brand" variant="outline" size="sm">
                I am a brand
              </Button>
              <Button href="/join/creator" variant="outline" size="sm">
                I am a creator
              </Button>
            </div>
          </div>

          <p className="text-muted mt-8 text-[13.5px]">
            Questions?{' '}
            <Link href="/contact" className="text-accent font-semibold hover:underline">
              Get in touch
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
