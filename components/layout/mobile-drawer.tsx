'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils/cn';

/**
 * Mobile navigation drawer, built on the native <dialog> element.
 *
 * WHY NATIVE RATHER THAN RADIX: the browser already implements everything a
 * modal needs - focus trapping, Escape to dismiss, inerting the page behind,
 * a ::backdrop pseudo-element and correct dialog semantics. Pulling in
 * @radix-ui/react-dialog for this added roughly 40 KB gzipped to *every* page
 * in the app, including the 404, to reimplement behaviour that ships with the
 * platform. The only thing `showModal()` does not handle is body scroll lock,
 * which is four lines below.
 *
 * Supported in every evergreen browser since 2022.
 */
export function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Site navigation"
      // `close` fires for Escape and for form-method=dialog submits, so this
      // single handler keeps React state in sync with native dismissals.
      onClose={onClose}
      // Clicking the backdrop resolves to the dialog element itself, since its
      // children occupy the inner panel only.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        'backdrop:bg-[rgb(10_15_30_/_0.45)] backdrop:backdrop-blur-sm',
        'm-0 ml-auto h-dvh max-h-dvh w-[min(360px,88vw)] max-w-none',
        'glass-md glass-readable rounded-none rounded-l-[var(--r-glass)] p-0',
        'open:animate-[drawer-in_.28s_cubic-bezier(.22,1,.36,1)]',
        'motion-reduce:open:animate-none',
      )}
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <Logo asLink={false} size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ink -mr-2 p-2"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        {children}
      </div>
    </dialog>
  );
}
