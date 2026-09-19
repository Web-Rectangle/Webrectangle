'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { primaryNav } from '@/lib/content/site';
import { cn } from '@/lib/utils/cn';

import { openCommandPalette } from './command-palette';
import { ThemeToggle } from './theme-toggle';

/**
 * Sticky site header.
 *
 * Inherits the legacy treatment - translucent background, backdrop blur, 76px
 * tall, hairline bottom border - and adds a shrink to 64px once the page
 * scrolls, which buys back vertical space on laptops without hiding navigation.
 *
 * The mobile drawer is a Radix Dialog rather than a styled div: it needs focus
 * trapping, Escape handling, scroll locking and background inerting, and Radix
 * gets all four right.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Threshold rather than a raw scrollY read so the class does not thrash on
    // sub-pixel scroll events.
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes, including on browser back.
  useEffect(() => setDrawerOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'text-[15px] font-medium transition-colors duration-200',
                isActive(item.href) ? 'text-accent' : 'text-ink hover:text-accent',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Search (Command K)"
            className="border-border text-muted hover:border-accent hover:text-accent flex items-center gap-2 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-medium transition-colors"
          >
            <Search aria-hidden="true" className="size-3.5" />
            <kbd className="font-sans">⌘K</kbd>
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

        <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Dialog.Trigger asChild>
            <button type="button" aria-label="Open menu" className="text-ink -mr-2 p-2 lg:hidden">
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[80] bg-[rgb(10_15_30_/_0.4)] backdrop-blur-sm lg:hidden" />
            <Dialog.Content
              className={cn(
                'glass-md glass-readable fixed inset-y-0 right-0 z-[85] w-[min(360px,88vw)]',
                'flex flex-col rounded-none rounded-l-[var(--r-glass)] p-6 lg:hidden',
              )}
            >
              <div className="flex items-center justify-between">
                <Dialog.Title asChild>
                  <span>
                    <Logo asLink={false} size="sm" />
                  </span>
                </Dialog.Title>
                <Dialog.Close aria-label="Close menu" className="text-ink -mr-2 p-2">
                  <X aria-hidden="true" className="size-6" />
                </Dialog.Close>
              </div>

              <Dialog.Description className="sr-only">
                Site navigation and account links
              </Dialog.Description>

              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'rounded-[10px] px-3 py-3 text-[16px] font-semibold transition-colors',
                      isActive(item.href)
                        ? 'bg-accent-soft text-accent'
                        : 'text-ink hover:bg-accent-soft',
                    )}
                  >
                    {item.label}
                    {item.description ? (
                      <span className="text-muted block text-[12.5px] font-normal">
                        {item.description}
                      </span>
                    ) : null}
                  </Link>
                ))}
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
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
