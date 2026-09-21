import { NextResponse } from 'next/server';

import { env, features } from '@/lib/env';
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

  /**
   * Store counts, development only.
   *
   * Exists because the in-memory adapter has a genuine failure mode: Next
   * compiles each route into its own server bundle, so a store held in module
   * scope ends up duplicated and writes from one route are invisible to
   * another. These counts make that immediately observable - submit a lead,
   * check here, see the number move.
   *
   * Counts only, never records, and omitted entirely in production so a public
   * endpoint cannot be used to infer inbound volume.
   */
  const store =
    env.NODE_ENV === 'development'
      ? {
          leads: (await repos.leads.list()).length,
          waitlist: (await repos.waitlist.list()).length,
        }
      : undefined;

  return NextResponse.json(
    {
      ok: true,
      adapter: repos.adapter,
      ...(store ? { store } : {}),
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
