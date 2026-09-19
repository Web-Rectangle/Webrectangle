import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Eyebrow } from '@/components/brand/eyebrow';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { articleBySlug, formatArticleDate } from '@/lib/content/resources';

/**
 * Chrome around an MDX article.
 *
 * Wrapping the body rather than templating it keeps each article a plain
 * Markdown file - the header, dateline and closing call to action come from
 * the typed index in lib/content/resources.ts, so an article file contains
 * nothing but its own prose.
 */
export function ArticleShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const article = articleBySlug(slug);

  // A file with no matching index entry is a mistake, not a valid page - the
  // index drives the listing, the sitemap and the metadata.
  if (!article) notFound();

  return (
    <article>
      <div className="relative overflow-hidden pt-12 pb-8">
        <BackgroundLayers fade="y" aurora={false} />

        <div className="container-wr max-w-[720px]">
          <Link
            href="/resources"
            className="text-muted hover:text-accent mb-8 inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            All resources
          </Link>

          <Eyebrow className="mb-4">{article.tag}</Eyebrow>
          <h1 className="mb-4 text-[clamp(30px,4vw,44px)]">{article.title}</h1>
          <p className="text-muted text-[14px] font-semibold">
            {formatArticleDate(article.published)} &middot; {article.readingMinutes} min read
          </p>
        </div>
      </div>

      <div className="container-wr max-w-[720px] pb-16">{children}</div>

      <div className="container-wr max-w-[720px] pb-20">
        <div className="border-border bg-accent-softer rounded-[var(--r-glass)] border p-8">
          <h2 className="mb-2 text-[22px]">Running a campaign soon?</h2>
          <p className="mb-6 text-[15px]">
            Tell us the product and the audience, and we will come back with creators worth
            approaching.
          </p>
          <Button href="/contact" withArrow>
            Talk to us
          </Button>
        </div>
      </div>
    </article>
  );
}
