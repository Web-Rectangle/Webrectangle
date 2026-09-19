'use client';

import { Command } from 'cmdk';
import {
  ArrowUpRight,
  Compass,
  FileText,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { primaryNav, whatsappLink } from '@/lib/content/site';

/**
 * Event name used by other components to open the palette without needing a
 * shared store or context. Decoupled on purpose: the header's search button
 * should not force the whole header into the palette's render tree.
 */
const OPEN_EVENT = 'wr:open-command-palette';

/** Opens the command palette from anywhere on the client. */
export function openCommandPalette(): void {
  document.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/**
 * Command palette, opened with Cmd/Ctrl-K.
 *
 * Quality-of-life rather than decoration: it gives keyboard users a single
 * entry point to every page and the two contact channels without reaching for
 * the mouse, and it signals that this is a product built by people who use
 * products.
 *
 * Built on cmdk's Dialog, which brings focus trapping, Escape handling, scroll
 * locking and the correct ARIA combobox semantics with it - all things a
 * hand-rolled palette tends to get subtly wrong.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };

    const onExternalOpen = () => setOpen(true);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener(OPEN_EVENT, onExternalOpen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener(OPEN_EVENT, onExternalOpen);
    };
  }, []);

  // Close before navigating so the dialog does not linger over the new route.
  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Site command palette"
      className="fixed inset-0 z-[90]"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-[rgb(10_15_30_/_0.45)] backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="glass-md glass-readable fixed top-1/2 left-1/2 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-0 shadow-[var(--shadow-lg)]">
        <div className="border-border flex items-center gap-3 border-b px-4">
          <Search aria-hidden="true" className="text-muted size-4 shrink-0" />
          <Command.Input
            placeholder="Search pages and actions..."
            className="text-ink placeholder:text-muted w-full bg-transparent py-4 text-[15px] outline-none"
          />
          <kbd className="border-border text-muted hidden rounded border px-1.5 py-0.5 text-[11px] font-semibold sm:block">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          <Command.Empty className="text-muted px-3 py-8 text-center text-sm">
            Nothing matches that.
          </Command.Empty>

          <Command.Group
            heading="Pages"
            className="text-muted px-2 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase"
          >
            <Item onSelect={() => go('/')} icon={<Compass />} label="Home" />
            {primaryNav.map((item) => (
              <Item
                key={item.href}
                onSelect={() => go(item.href)}
                icon={<Compass />}
                label={item.label}
                hint={item.description}
              />
            ))}
            <Item onSelect={() => go('/about')} icon={<Users />} label="About" />
            <Item onSelect={() => go('/contact')} icon={<Mail />} label="Contact" />
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="text-muted px-2 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase"
          >
            <Item onSelect={() => go('/discover')} icon={<Search />} label="Find creators" />
            <Item onSelect={() => go('/join/creator')} icon={<Users />} label="Join as a creator" />
            <Item onSelect={() => go('/resources')} icon={<FileText />} label="Read the guides" />
            <Item
              onSelect={() => {
                setOpen(false);
                window.open(whatsappLink(), '_blank', 'noopener,noreferrer');
              }}
              icon={<MessageCircle />}
              label="Message us on WhatsApp"
              external
            />
            <Item
              onSelect={() => {
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                setOpen(false);
              }}
              icon={resolvedTheme === 'dark' ? <Sun /> : <Moon />}
              label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            />
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}

function Item({
  onSelect,
  icon,
  label,
  hint,
  external,
}: {
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  external?: boolean;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="text-ink data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14.5px] font-medium normal-case"
    >
      <span aria-hidden="true" className="text-muted [&_svg]:size-4">
        {icon}
      </span>
      <span className="flex-1 tracking-normal">{label}</span>
      {hint ? (
        <span className="text-muted hidden text-[12.5px] font-normal sm:block">{hint}</span>
      ) : null}
      {external ? <ArrowUpRight aria-hidden="true" className="text-muted size-3.5" /> : null}
    </Command.Item>
  );
}
