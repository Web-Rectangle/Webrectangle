#!/usr/bin/env node
/**
 * Guard against fabricated social proof creeping into the site.
 *
 * WHY THIS IS AUTOMATED: the single most damaging thing this project could do
 * to early trust is publish a number it cannot back. That risk does not come
 * from bad intent - it comes from someone writing "trusted by 200+ brands"
 * during a routine copy edit because it reads well. A reviewer will miss that.
 * A regex will not.
 *
 * Scans user-facing copy for the specific shapes fabricated proof takes:
 * counted claims, percentage outcomes, and superlatives we cannot evidence.
 *
 * Usage: node scripts/check-honesty.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const SCAN_DIRS = ['app', 'components', 'lib/content'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.mdx', '.json']);

/**
 * Each rule describes a pattern that, in marketing copy, almost always means
 * an invented figure. `allow` carries the narrow exceptions where the same
 * shape is legitimate.
 */
const RULES = [
  {
    name: 'Counted social proof',
    // "500+ brands", "1,000+ campaigns", "300 creators"
    pattern: /\b\d[\d,]*\+?\s*(brands?|creators?|influencers?|campaigns?|clients?|customers?)\b/gi,
  },
  {
    name: 'Percentage outcome claim',
    // "300% growth", "98% satisfaction". Engagement rates in seed data and
    // audience splits are excluded below.
    pattern: /\b\d+(\.\d+)?%\s*(growth|increase|roi|satisfaction|success|conversion|uplift)/gi,
  },
  {
    name: 'Unverifiable superlative',
    pattern: /\b(india'?s|world'?s)\s+(#?1|no\.?\s*1|number one|leading|largest|best|top)\b/gi,
  },
  {
    name: 'Trusted-by claim with a count',
    pattern: /trusted by\s+[\d\w]+\+?\s/gi,
  },
  {
    name: 'Guaranteed outcome',
    pattern: /\b(guaranteed|guarantee)\s+(results?|roi|growth|reach|conversions?)\b/gi,
  },
];

/**
 * Lines matching these are legitimate and skipped.
 *
 * The honesty rules are about claims WebRectangle makes about itself. Sample
 * creator metrics, explicit disclaimers and the rules in this file are all
 * fine, and flagging them would train everyone to ignore the check.
 */
const ALLOWED = [
  /content\/seed\//, // illustrative creator data
  /scripts\/check-honesty/, // this file's own patterns
  /never claim|do not claim|not a verdict|illustrative|sample data|sample creator/i,
  /pastCollaborations|engagementRate|femaleShare|primaryAgeShare|avgViews|followers/,
];

/**
 * Comment lines are skipped.
 *
 * Comments are not rendered, and several of them in this codebase deliberately
 * quote the forbidden phrasings as examples of what not to write. Scanning
 * them would mean the documentation of a rule violates the rule, which trains
 * everyone to ignore the check.
 */
function isComment(line) {
  const trimmed = line.trim();
  return (
    trimmed.startsWith('//') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('#')
  );
}

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
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (SCAN_EXTENSIONS.has(extname(entry.name))) {
      out.push(full);
    }
  }

  return out;
}

const files = SCAN_DIRS.flatMap((dir) => {
  try {
    return statSync(dir).isDirectory() ? walk(dir) : [];
  } catch {
    return [];
  }
});

const findings = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, index) => {
    if (isComment(line)) return;
    if (ALLOWED.some((allow) => allow.test(file) || allow.test(line))) return;

    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;
      const match = rule.pattern.exec(line);
      if (match) {
        findings.push({
          file,
          line: index + 1,
          rule: rule.name,
          text: match[0].trim(),
          context: line.trim().slice(0, 100),
        });
      }
    }
  });
}

if (findings.length === 0) {
  console.log(
    `\nHonesty check passed. Scanned ${files.length} files, found no unverifiable claims.\n`,
  );
  process.exit(0);
}

console.error(`\nHonesty check FAILED - ${findings.length} possible fabricated claim(s):\n`);

for (const finding of findings) {
  console.error(`  ${finding.file}:${finding.line}`);
  console.error(`    rule:  ${finding.rule}`);
  console.error(`    match: "${finding.text}"`);
  console.error(`    line:  ${finding.context}`);
  console.error('');
}

console.error(
  'Every number on this site must be something we can evidence. If this claim is genuinely\n' +
    'verifiable, add it to ALLOWED in scripts/check-honesty.mjs with a comment explaining why.\n',
);

process.exit(1);
