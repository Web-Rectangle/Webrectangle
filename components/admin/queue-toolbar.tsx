'use client';

import { Download, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import type { Lead } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils/cn';

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
] as const;

/**
 * Search, sort and export for the submissions queue.
 *
 * All state is in the URL, so a filtered view can be linked to a colleague or
 * bookmarked, and the browser back button behaves. `replace` rather than
 * `push`, because refining a filter is not a navigation - pushing every
 * keystroke would bury the real previous page under dozens of history entries.
 */
export function QueueToolbar({ results }: { results: Lead[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // "/" to focus search, the convention in every tool that has a list to sift.
  // Ignored while typing, so it does not hijack the key inside a field.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const exportCsv = () => {
    const columns = [
      'name',
      'email',
      'company',
      'phone',
      'audience',
      'status',
      'source',
      'createdAt',
      'message',
    ] as const;

    // Quote every cell and double any embedded quotes - messages routinely
    // contain commas and newlines, which would otherwise shred the columns.
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      columns.join(','),
      ...results.map((lead) => columns.map((c) => escape(lead[c])).join(',')),
    ];

    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `webrectangle-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const query = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'newest';

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="border-border bg-surface focus-within:border-accent flex min-w-[220px] flex-1 items-center gap-2.5 rounded-[var(--r-btn)] border px-3.5 transition-colors">
        <Search aria-hidden="true" className="text-muted size-4 shrink-0" />
        <input
          ref={searchRef}
          type="search"
          defaultValue={query}
          onChange={(e) => setParam('q', e.target.value || null)}
          placeholder="Search name, email, company or message"
          aria-label="Search submissions"
          className="text-ink placeholder:text-muted w-full bg-transparent py-2.5 text-[14px] outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setParam('q', null)}
            aria-label="Clear search"
            className="text-muted hover:text-ink"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        ) : (
          <kbd className="border-border text-muted hidden rounded border px-1.5 py-0.5 text-[11px] font-semibold sm:block">
            /
          </kbd>
        )}
      </div>

      <label htmlFor="queue-sort" className="sr-only">
        Sort submissions
      </label>
      <select
        id="queue-sort"
        value={sort}
        onChange={(e) => setParam('sort', e.target.value === 'newest' ? null : e.target.value)}
        className="border-border bg-surface text-ink focus:border-accent cursor-pointer rounded-[var(--r-btn)] border px-3.5 py-2.5 text-[14px] font-semibold outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={exportCsv}
        disabled={results.length === 0}
        className={cn(
          'border-border text-body hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-[var(--r-btn)] border px-3.5 py-2.5 text-[14px] font-semibold transition-colors',
          results.length === 0 && 'pointer-events-none opacity-50',
        )}
      >
        <Download aria-hidden="true" className="size-4" />
        Export
      </button>
    </div>
  );
}
