'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils/cn';

/**
 * Copy a value to the clipboard.
 *
 * Small but disproportionately useful in a review queue: the most common
 * action after reading a submission is emailing the person, and selecting an
 * address by hand from a dense list is fiddly and error-prone.
 *
 * Shows an inline tick for two seconds as well as a toast, because the toast
 * appears at the bottom of the screen and the eye is already on the button.
 */
export function CopyButton({
  value,
  label = 'Copy',
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success(`${label} copied`);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access is denied in some browsers over plain HTTP.
          toast.error('Could not copy. Select and copy manually.');
        }
      }}
      aria-label={`${label}: ${value}`}
      className={cn(
        'text-muted hover:text-accent inline-flex items-center gap-1 text-[12.5px] font-semibold transition-colors',
        className,
      )}
    >
      {copied ? (
        <Check aria-hidden="true" className="text-positive size-3.5" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
      {copied ? 'Copied' : label}
    </button>
  );
}
