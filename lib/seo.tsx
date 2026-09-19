import type { Metadata } from 'next';

import { site } from '@/lib/content/site';
import { env } from '@/lib/env';

/**
 * Per-page metadata helper.
 *
 * Centralised so every route gets a canonical URL and consistent Open Graph
 * tags without each page remembering to add them. The title template in the
 * root layout appends the brand name, so `title` here is the page name alone.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.name}`,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * JSON-LD graph for the organisation and the site itself.
 *
 * Deliberately conservative: no aggregateRating, no review markup, no employee
 * counts. Structured data is a place where invented numbers get indexed and
 * repeated, and we have no verified figures to publish.
 */
export function organisationJsonLd() {
  const base = env.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}#organization`,
        name: site.name,
        url: base,
        description: site.description,
        founder: site.founders.map((name) => ({ '@type': 'Person', name })),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Noida',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: site.contact.email,
          telephone: `+${site.contact.whatsapp}`,
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
        sameAs: [site.contact.instagram],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}#website`,
        url: base,
        name: site.name,
        description: site.description,
        publisher: { '@id': `${base}#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${base}/discover?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

/** FAQPage markup. Only ever fed real questions and answers from lib/content. */
export function faqJsonLd(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: ReadonlyArray<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, env.NEXT_PUBLIC_SITE_URL).toString(),
    })),
  };
}

/** Renders a JSON-LD script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is built from our own content modules, never user
      // input, so serialising it directly is safe here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
