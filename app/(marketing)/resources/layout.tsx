/**
 * Shared shell for article pages.
 *
 * Constrains MDX content to a readable measure without every article having to
 * remember the wrapper. The index page sets its own width, and this measure is
 * wide enough not to fight it.
 */
export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <div className="[&_article]:container-wr">{children}</div>;
}
