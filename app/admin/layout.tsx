import { LogOut, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Logo } from '@/components/brand/logo';
import { adminLogout } from '@/lib/actions/admin';
import { isAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * Admin shell.
 *
 * The gate lives in the layout so every current and future page under /admin
 * inherits it - adding a route cannot accidentally ship unguarded. The Server
 * Actions re-check independently, because a layout guard protects the render,
 * not the endpoints.
 *
 * `force-dynamic` because the queue must never be served from a cache; a
 * stale admin list would show submissions that were already reviewed.
 */
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/login');

  return (
    <div className="bg-surface-alt min-h-dvh">
      <header className="border-border bg-surface border-b">
        <div className="container-wr flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="bg-accent-soft text-accent inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] uppercase">
              <ShieldCheck aria-hidden="true" className="size-3" />
              Admin
            </span>
          </div>

          <nav aria-label="Admin" className="flex items-center gap-5">
            <Link
              href="/admin"
              className="text-ink hover:text-accent text-[14.5px] font-medium transition-colors"
            >
              Submissions
            </Link>
            <Link
              href="/admin/creators"
              className="text-ink hover:text-accent text-[14.5px] font-medium transition-colors"
            >
              Creators
            </Link>
            <Link
              href="/discover"
              target="_blank"
              className="text-muted hover:text-accent hidden text-[14.5px] font-medium transition-colors sm:block"
            >
              View public page
            </Link>

            <form action={adminLogout}>
              <button
                type="submit"
                className="text-muted hover:text-critical flex items-center gap-1.5 text-[14px] font-semibold transition-colors"
              >
                <LogOut aria-hidden="true" className="size-3.5" />
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
