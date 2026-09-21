import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/sections/page-hero';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { formatArticleDate, sortedArticles } from '@/lib/content/resources';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Resources',
  description:
    'Practical guides on briefing creators, reading engagement data and running influencer campaigns that hold up.',
  path: '/resources',
});

export default function ResourcesPage() {
  const articles = sortedArticles();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
        ])}
      />

      <PageHero
        eyebrow="Resources"
        title="Things worth knowing before you"
        highlight="run a campaign."
        description="Short, practical pieces on the parts of influencer marketing that are usually learned the expensive way."
      />

      <section className="pb-20">
        <div className="container-wr max-w-4xl">
          <ul className="grid gap-5">
            {articles.map((article, i) => (
              <Reveal as="li" key={article.slug} delay={i * 0.06}>
                <Card interactive className="group p-7">
                  <Link href={`/resources/${article.slug}`} className="block">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="bg-accent-soft text-accent rounded-[var(--r-pill)] px-2.5 py-1 text-[11.5px] font-bold tracking-[0.06em] uppercase">
                        {article.tag}
                      </span>
                      <span className="text-muted text-[13px]">
                        {formatArticleDate(article.published)} &middot; {article.readingMinutes} min
                        read
                      </span>
                    </div>

                    <h2 className="group-hover:text-accent mb-2 flex items-start gap-2 text-[22px] transition-colors">
                      {article.title}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </h2>

                    <p className="text-[15px]">{article.description}</p>
                  </Link>
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
