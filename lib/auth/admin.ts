import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';

import { env } from '@/lib/env';

/**
 * Admin session handling.
 *
 * SCOPE: this is a single shared password guarding an internal review queue,
 * not a user accounts system. There is one admin (the founders), no roles, no
 * signups and no password reset. A full auth provider here would be
 * significantly more code to secure exactly one login, so this stays
 * deliberately small - and structured so NextAuth can replace it without
 * touching the pages, which only ever call `requireAdmin()`.
 *
 * The session is a signed, expiring cookie. It carries no data beyond an
 * expiry timestamp, so there is nothing useful to steal from it and nothing to
 * look up server-side.
 */

const COOKIE_NAME = 'wr_admin';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

/** Development-only fallback, rejected outright in production. */
const DEV_PASSWORD = 'webrectangle';

/**
 * Signing key. Falling back to a per-boot random value means sessions simply
 * do not survive a restart when ADMIN_SESSION_SECRET is unset - inconvenient
 * locally, but never insecure, and it avoids shipping a hardcoded default
 * secret that someone forgets to override.
 */
const SIGNING_KEY = env.ADMIN_SESSION_SECRET ?? randomBytes(32).toString('hex');

function sign(payload: string): string {
  return createHmac('sha256', SIGNING_KEY).update(payload).digest('hex');
}

/** Constant-time compare, so a response cannot be timed to guess the value. */
function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Check a submitted password.
 *
 * In production an unset ADMIN_PASSWORD locks the panel rather than falling
 * back to the development value - a deploy that forgets to configure it ends
 * up with an inaccessible admin, never a publicly guessable one.
 */
export function verifyPassword(candidate: string): boolean {
  const expected = env.ADMIN_PASSWORD ?? (env.NODE_ENV === 'production' ? null : DEV_PASSWORD);
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export async function createSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const jar = await cookies();

  jar.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** True when the request carries a valid, unexpired admin session. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const [payload, signature] = raw.split('.');
  if (!payload || !signature) return false;

  // Verify before trusting the payload - an attacker controls the cookie, so
  // the expiry inside it is meaningless until the signature checks out.
  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/**
 * Whether the panel can be signed into at all.
 *
 * Surfaced on the login screen so a production deploy with no ADMIN_PASSWORD
 * explains itself instead of silently rejecting every attempt.
 */
export function adminLoginAvailable(): boolean {
  return Boolean(env.ADMIN_PASSWORD) || env.NODE_ENV !== 'production';
}

/** True when the dev fallback password is in play, so the UI can say so. */
export function usingDevPassword(): boolean {
  return !env.ADMIN_PASSWORD && env.NODE_ENV !== 'production';
}
