import { NextResponse } from 'next/server';

import { features } from '@/lib/env';
import { getRepositories } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

/**
 * Liveness and configuration probe.
 *
 * Reports which adapter is active and which optional integrations are wired,
 * which is the fastest way to answer "why did that lead not arrive" or "is
 * this deployment actually talking to the database". Deliberately reports only
 * booleans - never a key, a URL or a connection string.
 */
export async function GET() {
  const repos = await getRepositories();

  return NextResponse.json(
    {
      ok: true,
      adapter: repos.adapter,
      features: {
        database: features.database,
        email: features.email,
        slack: features.slack,
        turnstile: features.turnstile,
        analytics: features.analytics,
        scheduling: features.scheduling,
      },
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
