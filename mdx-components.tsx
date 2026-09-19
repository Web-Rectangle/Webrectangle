import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

/**
 * Element mapping for MDX content.
 *
 * Required at the project root by @next/mdx. Styling lives here rather than in
 * a `prose` utility so article typography is governed by the same tokens as
 * the rest of the site and cannot drift from it.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="mb-5 text-[clamp(30px,4vw,42px)]">{children}</h1>,
    h2: ({ children }) => <h2 className="mt-12 mb-3 text-[26px]">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-2 text-[20px]">{children}</h3>,
    p: ({ children }) => <p className="mb-4 text-[16.5px] leading-relaxed">{children}</p>,
    ul: ({ children }) => (
      <ul className="mb-5 ml-5 grid list-disc gap-2 text-[16.5px] leading-relaxed">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-5 ml-5 grid list-decimal gap-2 text-[16.5px] leading-relaxed">
        {children}
      </ol>
    ),
    strong: ({ children }) => <strong className="text-ink font-bold">{children}</strong>,
    blockquote: ({ children }) => (
      <blockquote className="border-accent text-ink my-6 border-l-2 pl-5 text-[17px] font-medium italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-10" />,
    a: ({ href, children }) => {
      const url = href ?? '#';
      const external = url.startsWith('http');

      return external ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-semibold underline underline-offset-2"
        >
          {children}
        </a>
      ) : (
        <Link href={url} className="text-accent font-semibold underline underline-offset-2">
          {children}
        </Link>
      );
    },
    ...components,
  };
}
