'use client';

import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { type NavItem, primaryNav } from '@/lib/content/site';
import { useScrolledPast } from '@/lib/hooks/use-client-state';
import { cn } from '@/lib/utils/cn';

import { openCommandPalette } from './command-palette';
import { MobileDrawer } from './mobile-drawer';
import { ThemeToggle } from './theme-toggle';

/**
 * Sticky site header.
 *
 * Inherits the legacy treatment - translucent background, backdrop blur, 76px
 * tall, hairline bottom border - and adds a shrink to 64px once the page
 * scrolls, which buys back vertical space on laptops without hiding anything.
 */
export function Header() {
  // Threshold rather than a raw scrollY read, so the class does not thrash on
  // sub-pixel scroll events.
  const scrolled = useScrolledPast(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation, including browser back. Derived during
  // render rather than in an effect, which avoids a second render pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const navLink = (item: NavItem, mobile = false) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item.href) ? 'page' : undefined}
      onClick={mobile ? () => setDrawerOpen(false) : undefined}
      className={
        mobile
          ? cn(
              // 48px minimum height: comfortably above the 44px touch target
              // floor, which the previous 12px vertical padding sat under.
              'flex min-h-12 flex-col justify-center rounded-[10px] px-3 py-3 text-[16px] font-semibold transition-colors',
              isActive(item.href) ? 'bg-accent-soft text-accent' : 'text-ink hover:bg-accent-soft',
            )
          : cn(
              'flex items-center gap-1.5 text-[15px] font-medium transition-colors duration-200',
              isActive(item.href) ? 'text-accent' : 'text-ink hover:text-accent',
            )
      }
    >
      {/*
        The label and badge need their own flex row. Previously they sat in a
        bare <span>, so the link's `items-center` applied to that wrapper as a
        whole and the badge fell back to inline baseline alignment - sitting
        low against the text rather than centred on it.
      */}
      <span className="flex items-center gap-2 leading-none">
        {item.label}
        {item.status ? <StatusBadge status={item.status} size="nav" /> : null}
      </span>
      {mobile && item.description ? (
        <span className="text-muted mt-1 block text-[12.5px] leading-normal font-normal">
          {item.description}
        </span>
      ) : null}
    </Link>
  );

  return (
    <header
      className={cn(
        'glass-sm sticky top-0 z-50 rounded-none border-x-0 border-t-0',
        'border-b-border transition-shadow duration-300',
        scrolled && 'shadow-[0_4px_20px_rgb(10_15_30_/_0.08)]',
      )}
    >
      <div
        className={cn(
          'container-wr flex items-center justify-between gap-6',
          'transition-[height] duration-300 motion-reduce:transition-none',
          scrolled ? 'h-16' : 'h-[76px]',
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {primaryNav.map((item) => navLink(item))}
        </nav>

        {/* flex-1 so the search below can absorb whatever width is left after
            the logo, nav and actions, instead of a fixed size that overflows
            at 1024px or wastes space at 1440px. */}
        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          {/*
            Sized and labelled like a real search field rather than an icon
            button. The previous 30px icon-plus-shortcut control read as
            decoration - nobody clicks a thing they cannot identify, and the
            shortcut only helps people who already know it is there.

            Fluid between a usable floor and a sensible cap, so it is as wide
            as the layout can afford at any breakpoint.
          */}
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Search the site"
            className="border-border bg-surface-alt text-muted hover:border-accent hover:text-accent flex h-10 max-w-[340px] min-w-[150px] flex-1 items-center gap-2.5 rounded-[var(--r-btn)] border px-3.5 text-[14px] font-medium transition-colors"
          >
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="border-border bg-surface rounded border px-1.5 py-0.5 font-sans text-[11px] font-semibold">
              &#8984;K
            </kbd>
          </button>

          <ThemeToggle />

          <Link
            href="/login"
            className="text-ink hover:text-accent text-[15px] font-medium transition-colors"
          >
            Log In
          </Link>

          <Button href="/join/brand" size="sm" withArrow>
            Get Started
          </Button>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className="text-ink -mr-2 p-2 lg:hidden"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>

        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
            {primaryNav.map((item) => navLink(item, true))}
          </nav>

          {/* Search is desktop-only in the bar, so the drawer carries it for
              phones - otherwise the palette is unreachable without a keyboard. */}
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              openCommandPalette();
            }}
            className="border-border text-muted mt-4 flex min-h-12 items-center gap-2.5 rounded-[10px] border px-3 text-[15px] font-medium"
          >
            <Search aria-hidden="true" className="size-4" />
            Search the site
          </button>

          <div className="mt-auto space-y-3 pt-8">
            <ThemeToggle />
            <Button href="/login" variant="outline" fullWidth>
              Log In
            </Button>
            <Button href="/join/brand" fullWidth withArrow>
              Get Started
            </Button>
          </div>
        </MobileDrawer>
      </div>
    </header>
  );
}
