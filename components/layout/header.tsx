'use client';

import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { primaryNav } from '@/lib/content/site';
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

  const navLink = (href: string, label: string, description?: string, mobile = false) => (
    <Link
      key={href}
      href={href}
      aria-current={isActive(href) ? 'page' : undefined}
      onClick={mobile ? () => setDrawerOpen(false) : undefined}
      className={
        mobile
          ? cn(
              'rounded-[10px] px-3 py-3 text-[16px] font-semibold transition-colors',
              isActive(href) ? 'bg-accent-soft text-accent' : 'text-ink hover:bg-accent-soft',
            )
          : cn(
              'text-[15px] font-medium transition-colors duration-200',
              isActive(href) ? 'text-accent' : 'text-ink hover:text-accent',
            )
      }
    >
      {label}
      {mobile && description ? (
        <span className="text-muted block text-[12.5px] font-normal">{description}</span>
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

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => navLink(item.href, item.label))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Search (Command K)"
            className="border-border text-muted hover:border-accent hover:text-accent flex items-center gap-2 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-medium transition-colors"
          >
            <Search aria-hidden="true" className="size-3.5" />
            <kbd className="font-sans">&#8984;K</kbd>
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
            {primaryNav.map((item) => navLink(item.href, item.label, item.description, true))}
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <ThemeToggle className="w-fit" />
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
