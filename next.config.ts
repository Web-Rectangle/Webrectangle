import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `standalone` emits a self-contained server bundle in .next/standalone,
  // which is what the Dockerfile copies. Vercel ignores this and uses its own
  // build output, so setting it unconditionally is safe for both targets.
  output: 'standalone',

  reactStrictMode: true,

  // Fail the production build on type errors rather than shipping them.
  // Next 16 removed the `eslint` config key; linting runs via `npm run lint`
  // and is enforced separately in CI.
  typescript: { ignoreBuildErrors: false },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // `three` ships ESM that benefits from being transpiled alongside the app so
  // the tree-shaker can drop the large chunks we never import.
  transpilePackages: ['three'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
