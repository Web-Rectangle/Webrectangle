import { features } from '@/lib/env';

import { memoryRepositories } from './memory.adapter';
import type { Repositories } from './types';

export type * from './types';

/**
 * Repository facade - the only data entry point the rest of the app may use.
 *
 * THE SWAP: set DATABASE_URL and this resolves to the Prisma adapter instead
 * of the in-memory one. Nothing else changes. That is the whole migration
 * path, and it works because every consumer depends on the interfaces in
 * ./types rather than on a concrete implementation.
 *
 * The Prisma adapter is loaded with a dynamic import so it - and the optional
 * @prisma/client dependency it pulls in - stay completely out of the bundle
 * when no database is configured.
 *
 * Async by design: all consumers are Server Components, Server Actions or
 * route handlers, so awaiting costs nothing and avoids a synchronous
 * top-level side effect at module load.
 */
let cached: Promise<Repositories> | null = null;

async function resolve(): Promise<Repositories> {
  if (!features.database) return memoryRepositories;

  const { createPrismaRepositories } = await import('./prisma.adapter');
  return createPrismaRepositories();
}

export function getRepositories(): Promise<Repositories> {
  // Memoised on the promise rather than the value so concurrent callers during
  // cold start share a single client instantiation.
  cached ??= resolve();
  return cached;
}
