# WebRectangle

Marketing site for **WebRectangle**, an influencer marketing platform that helps brands discover
the right creators, connect with them, manage collaborations, and measure campaign performance.

Built with Next.js 16 (App Router), TypeScript, Tailwind v4 and React Three Fiber.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**No `.env` file is required.** The site runs fully configured out of the box: creator discovery
works against seed data, and every form captures and confirms. Setting environment variables
upgrades capabilities; leaving them unset never breaks one. See [`.env.example`](.env.example).

### Scripts

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Development server                                                   |
| `npm run build`        | Production build                                                     |
| `npm run check`        | Typecheck, lint and format check in one pass                         |
| `npm run lint:fix`     | Autofix lint and import ordering                                     |
| `node scripts/check-honesty.mjs`  | Scan copy for fabricated statistics (see below)           |
| `node scripts/measure-bundle.mjs` | Report per-route JavaScript weight                        |

---

## The one rule

**Never publish a number we cannot evidence.** WebRectangle is pre-launch. No invented brand
counts, campaign totals, growth percentages, testimonials, client logos or pricing tiers.

This is enforced in three ways rather than left to reviewer discipline:

1. **`<StatusBadge>`** — every feature block declares whether it is `live`, `beta` or `building`.
   A capability marked "Building" is honest *and* reads as a team with a roadmap, which is a
   stronger trust signal at this stage than vague confidence.
2. **`<SampleDataNotice>`** — the creator profiles in the hero and on `/discover` are illustrative.
   Every surface rendering them says so.
3. **`scripts/check-honesty.mjs`** — runs in CI and fails the build on counted social proof,
   percentage outcome claims and unverifiable superlatives. The risk is not bad intent; it is
   someone writing "trusted by 200+ brands" during a copy edit because it reads well.

The only genuine proof we have is allowlisted in [`lib/content/proof.ts`](lib/content/proof.ts).
Read the comments there before touching that file — the two testimonials are real but relate to
work predating the platform, which is why they are confined to `/about` with explicit context.

---

## Architecture

### Where things live

```
app/                 Routes. Flat, one directory per page.
  api/               Route handlers (health, creator search, lead capture)
components/
  brand/             Logo, isometric mark, eyebrow, icon tile
  ui/                Design-system primitives
  sections/          Page sections, mostly homepage
  discover/          Creator discovery: filter rail, explorer, comparison
  creators/          Creator card and platform badge
  three/             WebGL hero and its capability gate
  forms/             Server-Action-backed forms
lib/
  content/           ALL user-facing copy. Nothing is hardcoded in JSX.
  schemas/           Zod schemas; TypeScript types are inferred from these
  repositories/      Data access behind an interface (see below)
  creators/          Pure filter/sort logic, shared by server and client
  services/          Notification, rate limiting
  actions/           Server Actions
content/seed/        Illustrative creator data
prisma/              Database schema, ready to migrate
styles/              Design tokens and the glass material system
```

### The data layer

The UI never touches a data source. Every component, Server Action and route handler talks to the
interfaces in [`lib/repositories/types.ts`](lib/repositories/types.ts).

```
Server Components / Actions
          ↓
    repository facade          lib/repositories/index.ts
          ↓
  CreatorRepository, LeadRepository, WaitlistRepository
          ↓                              ↓
  memory.adapter (seed JSON)   prisma.adapter (Postgres)
```

**Moving to a real database is one environment variable.** Set `DATABASE_URL` and the facade
resolves to the Prisma adapter instead of the in-memory one, with zero component changes:

```bash
npm install @prisma/client
echo 'DATABASE_URL="postgresql://..."' >> .env.local
npx prisma migrate dev
```

The Prisma adapter is loaded through a dynamic import, so neither it nor `@prisma/client` is in
the bundle when no database is configured. `/api/health` reports which adapter is active.

### Forms never drop a lead

[`lib/services/notify.ts`](lib/services/notify.ts) cascades through every configured channel:

```
Resend email  →  Slack webhook  →  local JSONL (dev)  →  server log (always)
```

If every channel is unconfigured the submission still reaches the server log, and the success
state offers a prefilled WhatsApp handoff.

**Forms require JavaScript.** `useActionState` binds the Server Action client-side, so the
server-rendered markup carries no `$ACTION_ID` field and a no-JS submit will not reach the server.
React can progressively enhance this only with a `permalink` and a server-rendered result page per
form, which is not worth building here. A visitor without JavaScript is still not stranded: the
contact page's `mailto:` and WhatsApp links are plain anchors, and `POST /api/leads` exists for
programmatic use.

Anti-spam is a honeypot field plus a submit-timing check (both always on, no configuration) and
in-memory IP rate limiting. Turnstile is wired behind an env flag for when that stops being enough.

---

## Design system

The previous site (`legacy/indexV2.html`) was repositioned, not redesigned. Its palette maps onto
the new brand identity almost exactly, so the tokens are inherited rather than reinvented:

| Legacy    |          | Current         |                                |
| --------- | -------- | --------------- | ------------------------------ |
| `#1B5BFF` | →        | `--brand-500` `#0165FB` | brand mandate          |
| `#EAF0FF` | →        | `--brand-100` `#E8F1FF` | brand mandate          |
| `#F6F8FB` | →        | `--surface-alt` `#F7F9FC` | brand mandate        |
| `#0A0F1E` | unchanged | `--ink`        | already the required dark navy |

Everything resolves through [`styles/tokens.css`](styles/tokens.css). Components consume *semantic*
tokens (`bg-surface`, `text-ink`, `bg-accent`), never raw palette values — that is what makes dark
mode work.

Carried over from the legacy site and deliberately preserved: the `Web`+`Rectangle` logo lockup,
the `.hl` highlight span, the eyebrow's brand square, the `M7 17 17 7` CTA arrow and its hover
nudge, the circular check bullet, the FAQ `+` that rotates 45°, the CTA gradient band, the
WhatsApp FAB with its pulse ring, the 6s `floaty` keyframe, and the `cubic-bezier(.22,1,.36,1)`
reveal easing.

Run `/kitchen-sink` in development to see every primitive in light and dark.

### Glass

Three tiers in [`styles/glass.css`](styles/glass.css), with an `@supports` fallback to solid for
engines without `backdrop-filter` and an opt-out under `prefers-reduced-transparency`. Keep at most
~8 glass elements visible at once, and never animate `backdrop-filter` itself.

### The 3D hero

The legacy isometric cube illustration, rebuilt as real geometry — the brand motif made literal.

It is **never in the initial bundle**. `components/three/use-scene-gate.ts` skips WebGL entirely
under any of: `prefers-reduced-motion`, no WebGL2, viewport under 768px, save-data, or
`deviceMemory < 4`. Only once the gate approves *and* an IntersectionObserver reports the hero on
screen does the ~230 KB chunk load. The render loop parks when the tab is hidden or the hero
scrolls away.

The fallback is the static isometric SVG, which is the legacy brand illustration and looks
deliberate on its own. The `h1` is plain server-rendered text so it, not the canvas, is the LCP
element.

No `@react-three/drei`: its `Environment` presets fetch an HDR map from a CDN at runtime. The
rounded geometry and environment map are hand-rolled with no external fetch.

---

## Deployment

### Vercel

Zero config. Set `NEXT_PUBLIC_SITE_URL` to the production origin — it is inlined at build time.

### Docker

```bash
docker build -t webrectangle --build-arg NEXT_PUBLIC_SITE_URL=https://webrectangle.com .
docker run -p 3000:3000 --env-file .env.local webrectangle
```

Multi-stage, non-root, uses `output: 'standalone'`, with a healthcheck against `/api/health`.

---

## Known constraints

- **Client-side discovery filtering.** `/discover` filters in the browser over 24 seed records,
  which is faster than a round trip at this size. The same pure module
  ([`lib/creators/filter.ts`](lib/creators/filter.ts)) runs on the server, and
  `/api/creators/search` already exists, so the switch is a swap of the data source in
  `CreatorExplorer` — the filter shape and URL contract do not change.
- **In-memory rate limiting.** Single-instance and per-process. Effective against a script
  hammering a form, useless across serverless instances. Swap the `Map` in
  [`lib/services/rate-limit.ts`](lib/services/rate-limit.ts) for Upstash or Vercel KV when it
  matters; the signature is designed not to change.
- **React is pinned to `~19.2.8`.** `@react-three/fiber@9` requires `react >=19 <19.3`. Do not
  bump React without checking R3F's peer range first.
- **Partner logos are missing.** The four real logo files were never committed. `PartnerLogo`
  renders a neutral wordmark in their place — deliberately, since an absent asset must never be
  replaced with an invented brand. See [`public/logos/README.md`](public/logos/README.md).
- **Forms need JavaScript.** See the data-layer section above. The `mailto:`, WhatsApp and
  `POST /api/leads` paths do not.
- **Lighthouse has not been run.** The build was verified, but no browser-based audit was
  performed. Run `npx lighthouse http://localhost:3000 --view` against `npm run start` before
  treating any performance figure as measured.
- **Legal copy is not legal advice.** [`lib/content/legal.ts`](lib/content/legal.ts) describes what
  the product actually does, in plain English. Have a lawyer review before any material launch,
  particularly around DPDP Act obligations.

---

## Contributing

`npm run check` must pass, and so must `node scripts/check-honesty.mjs`. Copy goes in
`lib/content/`, never inline in JSX. Comments should explain constraints and reasoning, not
restate what the code does.
