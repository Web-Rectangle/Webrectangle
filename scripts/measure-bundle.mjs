#!/usr/bin/env node
/**
 * Report real per-route JavaScript weight from a production build.
 *
 * WHY THIS EXISTS: Next 16's Turbopack build output no longer prints per-route
 * First Load JS, and it emits no app-build-manifest to derive it from. This
 * reads the prerendered HTML instead and sums the gzipped size of every script
 * the page actually references, which is closer to what a browser downloads
 * than a manifest sum would be.
 *
 * Usage: npm run build && node scripts/measure-bundle.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const NEXT_DIR = '.next';
const SERVER_APP = join(NEXT_DIR, 'server', 'app');

/**
 * Reference sizes in KB gzipped, for context only - this script reports and
 * never fails a build.
 *
 * MEASURED BASELINE: Next 16 + React 19 ship roughly 170 KB gzipped of
 * framework runtime before a single line of application code; `/_global-error`
 * renders almost nothing and still costs that much. Useful as a floor to
 * compare against when judging whether a number is our code or the framework.
 */
const REFERENCE = { frameworkFloor: 170 };

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const htmlFiles = walk(SERVER_APP).filter((f) => f.endsWith('.html'));

if (htmlFiles.length === 0) {
  console.error('No prerendered HTML found. Run `npm run build` first.');
  process.exit(1);
}

const gzipCache = new Map();

function gzipSize(assetPath) {
  if (gzipCache.has(assetPath)) return gzipCache.get(assetPath);
  let size = 0;
  try {
    size = gzipSync(readFileSync(assetPath)).length;
  } catch {
    size = 0;
  }
  gzipCache.set(assetPath, size);
  return size;
}

const rows = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route =
    '/' +
    relative(SERVER_APP, file)
      .replace(/\.html$/, '')
      .replace(/^index$/, '');

  // Both eagerly loaded <script src> and the chunk list Next inlines for
  // client navigation show up as /_next/... paths in the markup.
  const refs = new Set([...html.matchAll(/\/_next\/(static\/[^"'\\\s)]+?\.js)/g)].map((m) => m[1]));

  let total = 0;
  for (const ref of refs) {
    total += gzipSize(join(NEXT_DIR, ref));
  }

  rows.push({ route, kb: total / 1024, chunks: refs.size });
}

rows.sort((a, b) => b.kb - a.kb);

console.log('\nPer-route JavaScript (gzipped, as referenced by the prerendered HTML)\n');
console.log('  ' + 'ROUTE'.padEnd(30) + 'JS'.padStart(11) + '  ' + 'CHUNKS'.padStart(7));
console.log('  ' + '-'.repeat(50));

for (const row of rows) {
  console.log(
    '  ' +
      row.route.padEnd(30) +
      `${row.kb.toFixed(1)} KB`.padStart(11) +
      String(row.chunks).padStart(7),
  );
}

// The 3D scene is lazy-loaded, so it never appears in the HTML above. Size it
// separately by finding the chunk that carries three.js.
const allChunks = walk(join(NEXT_DIR, 'static', 'chunks')).filter((f) => f.endsWith('.js'));
const threeChunks = allChunks.filter((f) => {
  try {
    if (statSync(f).size < 50_000) return false;
    return readFileSync(f, 'utf8').includes('THREE.WebGLRenderer');
  } catch {
    return false;
  }
});

if (threeChunks.length > 0) {
  const threeKb = threeChunks.reduce((sum, f) => sum + gzipSize(f), 0) / 1024;
  console.log(
    `\n  3D scene (lazy, not in initial load)  ${`${threeKb.toFixed(1)} KB`.padStart(10)}  ${String(threeChunks.length).padStart(6)}`,
  );
} else {
  console.log('\n  3D scene (lazy)                       not found in build output');
}

console.log(
  `\n  For reference, the Next + React runtime alone is about ${REFERENCE.frameworkFloor} KB.\n`,
);
