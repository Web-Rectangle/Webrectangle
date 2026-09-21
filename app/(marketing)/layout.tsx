import { SiteChrome } from '@/components/layout/site-chrome';

/**
 * Layout for every public page.
 *
 * A route group, so it adds no URL segment - `(marketing)/about` is still
 * `/about`. Its only job is to scope the site header, footer and floating
 * actions to public pages, keeping them off /admin.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
