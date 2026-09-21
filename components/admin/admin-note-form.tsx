'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/field';
import { saveAdminNote } from '@/lib/actions/admin';

/**
 * Private note attached to a submission.
 *
 * A review queue needs somewhere to record why a decision was made - "great
 * fit but no availability until March", "engagement looks bought, check again".
 * Without it that context lives in someone's head and is gone by the next
 * time the person gets in touch.
 *
 * Explicitly labelled as internal so nobody writes a reply here by mistake.
 */
export function AdminNoteForm({ id, note }: { id: string; note?: string }) {
  return (
    <form action={saveAdminNote} className="space-y-3">
      <input type="hidden" name="id" value={id} />

      <div>
        <label htmlFor="admin-note" className="text-ink mb-1 block text-[13.5px] font-semibold">
          Internal note
        </label>
        <p className="text-muted mb-2 text-[12.5px]">
          Only visible here. Never sent to the person who submitted.
        </p>
        <Textarea
          id="admin-note"
          name="note"
          defaultValue={note ?? ''}
          rows={4}
          placeholder="Context for whoever picks this up next..."
        />
      </div>

      <SaveButton />
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending ? 'Saving...' : 'Save note'}
    </Button>
  );
}
