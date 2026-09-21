import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublishCreatorForm } from '@/components/admin/publish-creator-form';
import { getRepositories } from '@/lib/repositories';

/**
 * Edit any creator, sample profiles included.
 *
 * Editing a sample promotes it: `parseCreatorForm` stamps `origin: 'admin'`,
 * and the saved copy shadows the seed record by id. That is intentional - once
 * an admin has curated a profile it is no longer illustrative, and it should
 * stop being labelled as such on Discover.
 */
export default async function EditCreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repos = await getRepositories();
  const creator = await repos.creators.findById(id);

  if (!creator) notFound();

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
        <h1 className="mb-1.5 text-[clamp(26px,3vw,34px)]">Edit {creator.displayName}</h1>
        <p className="max-w-2xl text-[15px]">
          {creator.origin === 'seed'
            ? 'This is one of the illustrative sample profiles. Saving turns it into a real listing and removes the sample label.'
            : 'Changes appear on Discover immediately.'}
        </p>
      </div>

      <PublishCreatorForm
        defaults={{ displayName: creator.displayName, handle: creator.handle }}
        existing={creator}
      />
    </main>
  );
}
