import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { PublishCreatorForm } from '@/components/admin/publish-creator-form';

/**
 * Add a creator with no submission behind them.
 *
 * Not every creator arrives through the website. Some are people the team
 * already represents, and the alternative - asking them to fill in the public
 * form so an admin can approve it - would be pure theatre.
 */
export default function NewCreatorPage() {
  return (
    <main className="container-wr py-10">
      <Link
        href="/admin/creators"
        className="text-muted hover:text-accent mb-7 inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to creators
      </Link>

      <div className="mb-7">
        <h1 className="mb-1.5 text-[clamp(26px,3vw,34px)]">Add a creator</h1>
        <p className="max-w-2xl text-[15px]">
          Publishes straight to Discover. Everything here is what a brand filters on, so it is worth
          filling in properly rather than coming back to it.
        </p>
      </div>

      <PublishCreatorForm defaults={{ displayName: '', handle: '' }} />
    </main>
  );
}
