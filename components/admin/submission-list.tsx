'use client';

import { Check, X } from 'lucide-react';
import { useState } from 'react';

import { SubmissionRow } from '@/components/admin/submission-row';
import { bulkReview } from '@/lib/actions/admin';
import type { Lead } from '@/lib/schemas/lead';

/**
 * The queue list, with multi-select.
 *
 * Bulk actions exist because triage is bursty - a batch of obvious spam or a
 * run of clearly-good creators should not need one round trip per row.
 *
 * Selection is intentionally client-only and resets after a bulk action: it
 * reflects "what I am looking at right now", and persisting it across
 * navigation would leave stale rows silently selected.
 */
export function SubmissionList({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = leads.length > 0 && selected.size === leads.length;
  const ids = [...selected];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="text-muted flex cursor-pointer items-center gap-2 text-[13.5px] font-semibold">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => setSelected(allSelected ? new Set() : new Set(leads.map((l) => l.id)))}
            className="accent-accent size-4"
          />
          {allSelected ? 'Clear selection' : 'Select all'}
        </label>

        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-ink text-[13.5px] font-bold">{selected.size} selected</span>

            <BulkForm ids={ids} status="approved" onDone={() => setSelected(new Set())}>
              <Check aria-hidden="true" className="size-3.5" />
              Approve selected
            </BulkForm>

            <BulkForm ids={ids} status="declined" onDone={() => setSelected(new Set())}>
              <X aria-hidden="true" className="size-3.5" />
              Decline selected
            </BulkForm>
          </div>
        ) : null}
      </div>

      <ul className="grid gap-4">
        {leads.map((lead) => (
          <SubmissionRow
            key={lead.id}
            lead={lead}
            selected={selected.has(lead.id)}
            selectionSlot={
              <input
                type="checkbox"
                checked={selected.has(lead.id)}
                onChange={() => toggle(lead.id)}
                aria-label={`Select ${lead.name}`}
                className="accent-accent size-4"
              />
            }
          />
        ))}
      </ul>
    </div>
  );
}

function BulkForm({
  ids,
  status,
  onDone,
  children,
}: {
  ids: string[];
  status: 'approved' | 'declined';
  onDone: () => void;
  children: React.ReactNode;
}) {
  return (
    <form action={bulkReview} onSubmit={onDone}>
      {ids.map((id) => (
        <input key={id} type="hidden" name="ids" value={id} />
      ))}
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={
          status === 'approved'
            ? 'bg-positive-soft text-positive hover:bg-positive flex items-center gap-1.5 rounded-[var(--r-btn)] px-3 py-2 text-[13px] font-semibold transition-colors hover:text-white'
            : 'border-border text-muted hover:border-critical hover:text-critical flex items-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-semibold transition-colors'
        }
      >
        {children}
      </button>
    </form>
  );
}
