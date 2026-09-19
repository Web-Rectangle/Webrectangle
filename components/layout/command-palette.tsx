'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * Event name used by other components to open the palette without a shared
 * store or context. Decoupled on purpose: the header's search button should
 * not drag the whole header into the palette's render tree.
 */
const OPEN_EVENT = 'wr:open-command-palette';

/** Opens the command palette from anywhere on the client. */
export function openCommandPalette(): void {
  document.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/**
 * The palette's contents pull in cmdk and Radix Dialog - about 40 KB gzipped.
 * Loading that on every page for a feature most visitors never trigger was the
 * single largest item in the shared bundle, so it is fetched on first open
 * instead. The import starts the moment the shortcut fires, and the chunk
 * arrives well inside the time it takes to type a query.
 */
const CommandPaletteContent = dynamic(
  () => import('./command-palette-content').then((m) => m.CommandPaletteContent),
  { ssr: false },
);

/**
 * Lightweight host for the command palette.
 *
 * All that ships on first load is this listener. It owns the open state and
 * mounts the real palette only once it has been requested.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  /** Latches true on first open so the chunk is fetched once and kept. */
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    const show = () => {
      setEverOpened(true);
      setOpen(true);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setEverOpened(true);
        setOpen((v) => !v);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener(OPEN_EVENT, show);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener(OPEN_EVENT, show);
    };
  }, []);

  if (!everOpened) return null;

  return <CommandPaletteContent open={open} onOpenChange={setOpen} />;
}
