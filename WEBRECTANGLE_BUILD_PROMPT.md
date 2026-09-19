# BUILD PROMPT — WebRectangle v3 Website

> Paste everything below this line into Claude Opus 5 Max.

---

You are the founding design engineer for **WebRectangle**. Build the complete public marketing website for our influencer marketing platform, from scratch, production-ready.

Read this entire brief before writing any code. At the end, list any assumptions you made.

---

## 1. WHO WE ARE (positioning — do not drift from this)

**WebRectangle is an influencer marketing platform that helps brands discover the right creators, connect with them, manage collaborations, and measure campaign performance.**

Short brand statement: **"Find the right creators. Build better campaigns."**

- Founders: Parth Maheshwari and Tarun. Based in Noida, India. Early-stage startup.
- We sit between **brands** and **creators** and own the full collaboration lifecycle: discovery → matching → outreach → collaboration → campaign management → analytics → reporting.
- Long-term ambition: the **operating system for influencer marketing**, not an influencer directory.

### Hard positioning rules

| Do | Don't |
|---|---|
| Position as a **technology product** that happens to solve influencer marketing | Position as a digital marketing agency, social media agency, or talent agency |
| Show the product | Show stock photos of people in meetings |
| Talk about discovery, matching, workflow, data | Talk about "10X growth", "synergy", "digital transformation" |
| Serve both brands and creators as first-class audiences | Treat creators as database rows |

**Absolutely do not mention or offer:** web development, app development, social media management, YouTube channel management, SEO services, general "AI solutions" consulting. Those were the old business. They are gone from all customer-facing surfaces.

We are replacing an existing site (`indexV2.html`, a digital-agency site). This is a **rebrand + repositioning**, but we are deliberately **inheriting its visual DNA** — see §3 and §4.

---

## 2. THE HONESTY CONSTRAINT (this is the most important rule in the brief)

We are pre-launch. **Never fabricate proof.** Specifically, never invent:

- Number of brands, creators, or campaigns
- Revenue, growth percentages, ROI figures, "300% average growth"
- Testimonials, client logos, case studies
- Creator names with follower counts presented as real inventory
- Platform integrations or API partnerships we don't have
- Pricing tiers (our business model is **not finalised**)

**Instead, solve this with design.** Three patterns to implement:

1. **`<StatusBadge>` component** with states `live` / `beta` / `building`. Every feature block carries one. An AI feature labelled `Building` is honest *and* makes us look like a real product team with a roadmap. This turns our biggest weakness into a credibility signal.
2. **Demo data must be self-labelling.** The interactive creator cards in the hero and on `/discover` are a product demo. Every mock dataset renders inside a container with a visible `Sample data` / `Product preview` chip, and the seed data uses obviously illustrative handles (`@aarav.builds`, `@themacrokitchen`, `@fitwithriya`) — never a real person's name, photo, or metrics. Use generated avatars (initials on brand-tinted circles or DiceBear-style SVG), never scraped photos.
3. **Pricing page sells a conversation, not a tier.** No fake `$49/mo` cards.

### The only real proof we have — use exactly this, nothing more

**Organisations we've worked with** (logo files already exist, reuse them):
`MEITY logo.webp`, `up govt logo.webp`, `mybigguidelogo.png`, `pcschool logo.jpeg`

**Two genuine testimonials** (verbatim, attribution as written):

> "Web Rectangle has shown commendable dedication in supporting social media management initiatives for the District Administration. Their team maintained a professional approach, ensured timely delivery, and contributed effectively toward enhancing digital engagement and public outreach."
> — **Joint Director (I.T.)**, National Informatics Centre (NIC), Ministry of Electronics & Information Technology

> "From planning to execution, Web Rectangle showcased a structured and result-oriented approach. Their team proved to be a reliable technology and digital partner."
> — **E-District Manager**, District Administration, Govt of Uttar Pradesh

⚠️ **Important framing problem you must solve:** these testimonials are about *prior social media work*, not influencer marketing. Do **not** put them in a "what brands say about our platform" section — that would be misleading. Place them on `/about` under a heading like **"Where we come from"** or **"Track record"**, with one honest line of context such as *"Before WebRectangle, our team delivered digital and social programmes for government and education organisations."* Same for the logo strip — label it **"Teams we've worked with"**, not "Trusted by 200+ brands".

**Contact facts:** `contact@webrectangle.com` · `+91 93680 65654` (also WhatsApp) · Noida, India · Instagram `@webrectangle`

---

## 3. DESIGN SYSTEM — inherited tokens (use these exact values)

The old site is being repositioned, not visually thrown away. Its palette maps onto the new brand identity almost 1:1. **This mapping is mandatory.**

```css
/* tokens.css — single source of truth. Every colour in the app resolves here. */
:root {
  /* ---- Brand ramp. 500 and 100 are mandated by brand guidelines. ---- */
  --brand-50:  #F0F6FF;
  --brand-100: #E8F1FF;  /* mandated "very light blue" (was legacy #EAF0FF) */
  --brand-200: #CFE0FF;
  --brand-300: #A6C6FF;
  --brand-400: #5B9BFD;
  --brand-500: #0165FB;  /* MANDATED PRIMARY (was legacy #1B5BFF) */
  --brand-600: #0153D1;
  --brand-700: #0142A6;  /* gradient partner (was legacy #0B3ED9) */
  --brand-800: #01337E;
  --brand-900: #04255A;

  /* ---- Neutrals. Carried over from the legacy site unchanged. ---- */
  --ink:      #0A0F1E;  /* headings — already the "dark navy" the new brand asks for */
  --body:     #5A6472;  /* body copy */
  --surface:  #FFFFFF;
  --surface-alt: #F7F9FC;  /* mandated light grey (was legacy #F6F8FB) */
  --border:   #E8EBF0;

  /* ---- Functional. Use sparingly. ---- */
  --star: #FFB800;
  --whatsapp: #25D366;
  --success: #137A3D;
  --success-bg: #E8F9EF;

  /* ---- Elevation (legacy values, keep) ---- */
  --shadow:    0 8px 30px rgba(0,0,0,.06);
  --shadow-lg: 0 16px 48px rgba(10,15,30,.12);
  --shadow-glass: 0 20px 60px rgba(1,101,251,.10), 0 2px 8px rgba(10,15,30,.04);

  /* ---- Radii (legacy values, plus one for glass) ---- */
  --r-btn: 10px;
  --r-card: 16px;
  --r-glass: 22px;
  --r-pill: 999px;
}
```

**Typography — unchanged from legacy, it was already right.**

- **Inter**, weights 400/500/600/700/800. Load via `next/font` (self-hosted, `display: swap`) — not a Google Fonts `<link>`. Add `Inter` variable font with `font-feature-settings: 'cv11','ss01'` and tabular numerals for all metrics.
- Headings: `color: var(--ink)`, `letter-spacing: -0.02em`, `line-height: 1.12`, `font-weight: 800`.
- Body: `16px / 1.6`, `color: var(--body)`, `-webkit-font-smoothing: antialiased`.
- `h1`: `clamp(40px, 5.6vw, 72px)` · `h2`: `clamp(30px, 4vw, 42px)`.
- Metrics/numbers: `font-variant-numeric: tabular-nums`, `letter-spacing: -0.03em`.

**Spacing:** 4px base scale. Sections `96px` desktop / `68px` mobile — but the old site felt long, so **cut total page height ~30%** by merging redundant sections rather than shrinking padding. Container `max-width: 1200px`, `padding: 0 24px`.

---

## 4. LEGACY DNA — keep these, they are the brand

These components must survive the rebrand. They are what makes it recognisably WebRectangle.

| Element | Spec | Note |
|---|---|---|
| **Logo lockup** | `Web` in `--ink` (800) + `Rectangle` in white on a `--brand-500` rounded rect (`padding: 3px 10px 4px`, `radius: 8px`, `margin-left: 4px`) | Non-negotiable brand mark. Ship as an SVG React component with `light`/`dark`/`mono` variants. |
| **Isometric rectangle motif** | Blue + white isometric cubes with three-face gradients (`gTop` / `gLeft` / `gRight`) | The "Rectangle" in our name. Becomes the 3D hero — see §6. Keep the SVG version as the fallback and as a footer/404 flourish. |
| **Highlight span (`.hl`)** | Brand background, white text, `border-radius: 12px`, `padding: 0 14px 4px` | Used once per page in the `h1`. High-signal, don't overuse. |
| **Eyebrow** | `12.5px / 700 / letter-spacing .12em / uppercase`, brand colour, with an `::before` 8px brand square (`radius: 2px`) | The little square is the rectangle motif in miniature. Keep it. |
| **Icon tile** | `52px`, `radius: 14px`, `linear-gradient(135deg, var(--brand-500), var(--brand-700))`, white 2px-stroke SVG inside | The old site over-used these. **Use at most 6 per page.** |
| **Card** | White, `1px solid var(--border)`, `radius: 16px`, `--shadow`, hover `translateY(-4px)` + `--shadow-lg`, `transition: .3s` | |
| **CTA arrow** | SVG path `M7 17 17 7M8 7h9v9`, `translate(2px,-2px)` on hover | Signature micro-interaction. Every primary CTA gets it. |
| **Check bullet (`.chk`)** | 26px brand circle, white 3px-stroke tick | |
| **FAQ disclosure** | `<details>` + `.pm` 28px `--brand-100` circle with `+` that `rotate(45deg)` on open | Native `<details>` — keeps it accessible and JS-free. |
| **CTA band** | `linear-gradient(120deg, var(--brand-500), var(--brand-700))` with a 40px white grid overlay at `.05` alpha | One per page, directly before the footer. |
| **Hero grid backdrop** | 44px grid lines at `rgba(1,101,251,.045)` fading to white at the top | Now the base layer under the glass — see §5. |
| **WhatsApp FAB** | 58px `--whatsapp` circle, bottom-right, with the 2s `wa-pulse` expanding-ring keyframe | Real conversion driver for Indian SMB. Keep it. |
| **`floaty` keyframe** | `6s ease-in-out infinite`, `translateY(-12px)` at 50%, staggered `animation-delay` | Reuse for floating glass panels. |
| **Scroll reveal** | `opacity: 0; translateY(28px)` → `.in`, `cubic-bezier(.22,1,.36,1)`, staggered `transition-delay` | Rebuild in Framer Motion but keep the exact easing and 28px distance. |
| **Focus ring** | `outline: 3px solid rgba(1,101,251,.45); outline-offset: 2px` | |
| **Reduced-motion block** | Legacy site kills all animation under `prefers-reduced-motion` | Keep, and extend to disable the 3D canvas entirely. |

### Delete these from the legacy site

- Every unverified stat: "Trusted by 50+ Brands", "300% Avg. Growth", "100+ Growth Partnerships", "24/7 Expert Support"
- All non-influencer services (nav dropdown, services grid, footer links)
- The three fabricated portfolio thumbnails (SaaS Platform / Fintech App / E-commerce)
- The generic "Why Choose Us" platitude checklist (Strategy First, Fast Delivery, …)
- The wall of near-identical blue gradient tiles
- Any section restating something already said

---

## 5. GLASS UI SYSTEM

Glass is the visual upgrade that carries the brand from "agency site" to "premium product". The legacy site already had three glass elements — the sticky header (`rgba(255,255,255,.92)` + `blur(12px)`), the floating `.stat-card`s (`rgba(255,255,255,.9)` + `blur(8px)`), and the `.chip`. **Systematise that instinct.**

**Glass only reads as glass if there's something interesting behind it.** So build the background first:

```
Layer 0  —  base surface (white / --surface-alt)
Layer 1  —  44px brand grid, rgba(1,101,251,.045), masked to fade at section edges
Layer 2  —  2–3 soft radial "aurora" blooms in --brand-400/--brand-200 at 8–14% opacity,
            heavily blurred, very slow drift (60s+). Subtle. Not a gradient mesh party.
Layer 3  —  the 3D canvas (hero only)
Layer 4  —  glass panels and content
```

**Glass tiers** (three only — more creates visual noise):

```css
/* .glass-sm — chips, badges, nav pills */
background: rgba(255,255,255,.72);
backdrop-filter: blur(12px) saturate(160%);
border: 1px solid rgba(255,255,255,.65);
box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 2px 8px rgba(10,15,30,.05);

/* .glass-md — floating creator cards, stat pills, the hero search bar */
background: rgba(255,255,255,.78);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255,255,255,.7);
border-radius: var(--r-glass);
box-shadow: inset 0 1px 0 rgba(255,255,255,.95), var(--shadow-glass);

/* .glass-dark — on the CTA band / dark sections */
background: rgba(255,255,255,.10);
backdrop-filter: blur(16px) saturate(140%);
border: 1px solid rgba(255,255,255,.22);
```

**Rules that keep it usable, not just pretty:**

- **Contrast is non-negotiable.** Body text on glass must hit 4.5:1 against the *lightest* pixel that can appear behind it. If a panel carries paragraph text, raise opacity to `.92` or drop the glass. Write a quick contrast check into your review pass.
- `@supports not (backdrop-filter: blur(1px))` → fall back to solid `rgba(255,255,255,.96)` with `--border`. Firefox-on-old-hardware and some Android webviews need this.
- `backdrop-filter` is expensive. **Cap it at ~8 simultaneously visible glass elements.** Never animate `backdrop-filter` itself — animate `opacity` and `transform` only.
- Add `will-change: transform` only on elements actively animating, and remove it after.
- The inset top highlight (`inset 0 1px 0 rgba(255,255,255,.9)`) is what sells the material. Don't skip it.
- Dark mode: invert to `rgba(16,22,40,.72)` with `border: 1px solid rgba(255,255,255,.08)` and an inset highlight at `.06`.

---

## 6. 3D SYSTEM

**Concept: the isometric cubes from the old site become real geometry.** This is the single strongest continuity link between old and new brand, and it's genuinely on-concept — we're literally called WebRectangle.

### Hero scene

A slow-orbiting constellation of **rounded rectangular slabs** in 3D space around a central WebRectangle mark:

- 5–7 slabs. Two materials: **frosted glass** (`MeshTransmissionMaterial`, low thickness, brand-tinted) and **solid brand** (`#0165FB` with a subtle iridescent clearcoat).
- Each slab is a physical stand-in for a creator card — a couple of them carry a rendered creator-card texture (via `<Html transform>` or a canvas texture) so the 3D directly reinforces "this is a product".
- Motion: continuous slow Y-rotation (~0.05 rad/s), independent per-slab `floaty` bob at staggered phases, and **subtle cursor parallax** (damped, max ±4° — not a tilt-whiplash toy).
- Lighting: one key light, soft `Environment preset="city"` at low intensity, contact shadows. Keep bloom off or ≤0.15 — the brief says avoid excessive effects.

### Performance contract (treat as hard requirements)

- **LCP must be the `h1` text, never the canvas.** Render heading, subheading and CTAs as static server-rendered HTML; mount the canvas after.
- `next/dynamic(..., { ssr: false })` + `<Suspense>`, gated behind an `IntersectionObserver` so it never initialises off-screen.
- 3D chunk ≤ **150 KB gzipped**. Import from `three` selectively; no full `drei` barrel import.
- `dpr={[1, 1.75]}`, `frameloop="demand"` where possible, `gl={{ antialias: false, powerPreference: 'high-performance' }}` with FXAA instead.
- **Pause the render loop** on `document.hidden`, on scroll past, and when battery saver / `navigator.connection.saveData` is on.
- **Fallback ladder** — render the static legacy isometric SVG (upgraded with the new brand ramp) when *any* of: `prefers-reduced-motion`, no WebGL2, viewport < 768px, `saveData`, or `deviceMemory < 4`. The SVG fallback must look deliberate and good, not broken.

### 3D elsewhere — restrained

- **Card tilt**: CSS `rotateX/rotateY` ≤ 6° driven by pointer position, GPU-only transforms. No R3F.
- **"How it Works"**: scroll-driven progression along the 5 steps where each stage card lifts on Z and the connector fills. `useScroll` + `useTransform`, `transform`/`opacity` only.
- **Section transitions**: slabs that appear to pass behind the next section, via a shared sticky background layer.
- Everywhere else, 2D. The brief says *minimal and premium* — restraint is the point.

---

## 7. TECH STACK & ARCHITECTURE

### Stack

- **Next.js 15+, App Router, TypeScript strict** (`strict: true`, `noUncheckedIndexedAccess: true`)
- **Tailwind CSS v4** with `@theme` reading from `tokens.css` — tokens defined once, consumed as Tailwind utilities *and* raw CSS vars
- **Framer Motion** (`motion`) for reveal/layout animation
- **React Three Fiber + selected `drei` helpers** for the hero
- **Zod** for every schema — shared between client and server
- **Lucide React** for icons, but the signature icons (logo, CTA arrow, check, isometric cubes) stay as hand-authored SVG components
- `next-themes` for dark mode
- `sonner` for toasts, `cmdk` for the command palette

### Repository layout

```
app/
  (marketing)/
    page.tsx                  # home
    for-brands/page.tsx
    for-creators/page.tsx
    how-it-works/page.tsx
    discover/page.tsx         # interactive creator discovery demo
    pricing/page.tsx
    about/page.tsx
    contact/page.tsx
    resources/                # MDX-ready, ships with 2 real posts
    (legal)/privacy|terms/page.tsx
  (auth)/login/page.tsx       # visual stub, wired to a no-op adapter
  join/brand/page.tsx
  join/creator/page.tsx
  api/
    leads/route.ts
    waitlist/brand/route.ts
    waitlist/creator/route.ts
    creators/search/route.ts  # reads the repository layer
    health/route.ts
  opengraph-image.tsx
  sitemap.ts · robots.ts · not-found.tsx · error.tsx · global-error.tsx

components/
  ui/          # Button, Card, Glass, Badge, StatusBadge, Input, Select, Chip, Toast…
  three/       # HeroScene, Slab, useSceneGate, IsometricFallback
  sections/    # Hero, Problem, Solution, Discovery, HowItWorks, ForBrands, …
  layout/      # Header, Footer, MobileNav, CommandPalette, WhatsAppFab, ScrollProgress
  brand/       # Logo, IsometricMark, Eyebrow, IconTile

lib/
  types/       # Creator, Campaign, Brand, Invitation, Shortlist, Lead, Deliverable
  schemas/     # Zod — one schema per type, single source for form + API validation
  repositories/
    index.ts           # export const repos = createRepositories(adapter)
    types.ts           # CreatorRepository, LeadRepository — interfaces only
    memory.adapter.ts  # ships enabled; reads seed JSON
    prisma.adapter.ts  # written, commented, wired behind DATABASE_URL
  services/    # email, analytics, rate-limit, notify — each env-gated with a no-op default
  content/     # ALL copy lives here as typed objects. Zero hardcoded strings in JSX.
  utils/
  env.ts       # Zod-validated process.env, fails fast at build

content/seed/  # creators.json, faqs.json, logos.json — clearly marked sample data
prisma/schema.prisma  # complete, ready to `prisma migrate dev`
```

### "Backend-friendly for quick deployment" — what this concretely means

This is a core requirement. Build it so that going from static marketing site to real backend is **configuration, not refactoring**.

1. **Repository pattern.** UI never touches a data source. It calls `repos.creators.search(filters)`. Today that's `memory.adapter.ts` reading seed JSON; tomorrow you set `DATABASE_URL` and `repos` resolves to `prisma.adapter.ts`. Same interface, zero component changes. Write both adapters now.
2. **Prisma schema ships complete** — `Creator`, `Brand`, `Campaign`, `Invitation`, `Shortlist`, `Deliverable`, `Lead`, `WaitlistEntry`, with the enums from our workflow (invitation: `SENT | ACCEPTED | REJECTED | CHANGES_REQUESTED`; campaign: `DRAFT → INVITED → ACCEPTED → NEGOTIATION → ACTIVE → IN_PROGRESS → SUBMITTED → REVIEW → REVISION → APPROVED → PUBLISHED → COMPLETED`). It doesn't need to run on day one — it needs to be ready.
3. **Every form works with zero backend configured.** Server Action → Zod validate → `LeadRepository.create()`. The default notify service writes to a JSONL file in dev and logs in prod; if `RESEND_API_KEY` is set it emails; if `SLACK_WEBHOOK_URL` is set it posts; if neither, it still returns success and falls back to a prefilled WhatsApp deeplink to `+91 93680 65654` (carry over the legacy WhatsApp form handoff — it converts). **Nothing silently drops a lead.**
4. **`lib/env.ts`** validates env with Zod at build time. Every integration is optional with a documented no-op default. Ship `.env.example` with inline comments.
5. **Deploy targets:** Vercel zero-config *and* a working multi-stage `Dockerfile` with `output: 'standalone'`. `/api/health` returns `{ ok, version, commit }`.
6. **Progressive enhancement:** forms are real `<form action={serverAction}>`, functional with JS disabled. `useFormStatus` for pending states.

---

## 8. SITE MAP & PAGE SPECS

### Navigation

`WebRectangle` │ For Brands · For Creators · How It Works · Discover Creators · Pricing · Resources │ `Log In` · **`Get Started`**

Sticky, glass, 76px, shrinks to 64px on scroll with a hairline border. Mobile: full-screen glass drawer. On mobile, a sticky bottom CTA bar appears after 40% scroll: **`Find Creators`** / **`Join as Creator`**.

---

### HOME (`/`)

**1 · Hero** — the most important thing on the site. It must make it obvious within 5 seconds that we are a *product*.

- Eyebrow: `Influencer Marketing Platform`
- H1: **Find the right creators. <span class="hl">Build better campaigns.</span>**
- Sub: *Discover relevant creators, send structured collaboration invites, manage campaigns and measure what actually performed — in one place.*
- CTAs: **`Find Creators`** (primary) · `Join as a Creator` (outline)
- Trust line beneath: `Instagram · YouTube` · `Discovery · Outreach · Campaigns · Analytics`
- **Right side: a live, interactive product demo** floating in glass over the 3D scene — a working search input, filter chips (`Fitness` `Delhi NCR` `Instagram` `20K–100K`), and 2–3 glass creator cards showing handle, niche, location, followers, engagement, with `Shortlist` and `Invite` buttons. Clicking a chip **actually refilters** the local seed data. Carries a visible `Product preview · sample data` chip.

This interactive hero is the whole pitch. Invest your effort here.

**2 · Worked-with strip** — the four real logos, greyscale → colour on hover, heading `Teams we've worked with`. No count claims.

**3 · Problem** — *"Influencer marketing shouldn't live in 14 browser tabs."* Show the mess visually: scattered glass fragments labelled `Instagram DMs`, `Email`, `WhatsApp`, `Google Sheets`, `Manual research`, `Screenshot analytics` — which snap together on scroll into one clean WebRectangle panel. This is the single best animation opportunity on the page. Then one line: *"WebRectangle brings the whole workflow into one place."*

**4 · Solution / platform overview** — 4 glass cards, each with a `StatusBadge`: **Discovery** · **Outreach & Invites** · **Campaign Management** · **Analytics**. One outcome line each, no feature lists.

**5 · Creator Discovery showcase** — the highest-value section after the hero. A wide glass panel showing the real discovery UI: filter rail (Platform, Category, Location, Followers, Engagement, Audience, Language, Budget), results grid, and a working sort. Interactive with seed data. Subheading calls out the future natural-language search with a `Building` badge and a real example query: *"Find 20 Instagram fitness creators in Delhi NCR with 20K–100K followers."*

**6 · How It Works** — `01 Discover → 02 Shortlist → 03 Connect → 04 Collaborate → 05 Measure`. Scroll-driven, with the legacy dashed connector reimagined as a filling gradient line.

**7 · Two-audience split** — side-by-side glass panels. **For Brands** → `Start a Campaign`. **For Creators** → `Join as a Creator`. Visually distinct (brands: light/brand-tinted; creators: inverted dark glass) so both audiences self-select instantly.

**8 · "Invite to Collaborate"** — our signature product concept, deserves its own section. Show the actual invitation card: brand, campaign, deliverables, timeline, budget, usage rights → and the three creator responses: **Accept** · **Request Changes** · **Reject**. Animate the state change on scroll.

**9 · AI, honestly** — heading *"AI that does the boring parts."* 4 capabilities, each with an honest `StatusBadge` and a concrete example, not a buzzword: natural-language search, creator–campaign matching, outreach drafting, report summarisation. Add one line of integrity: *"AI narrows the field. You make the call."* Mention engagement-quality **signals** and **risk indicators** — never claim fraud detection.

**10 · Why WebRectangle** — 3 points max, differentiation not platitudes: *Relevance over reach* · *Structured outreach, not scattered DMs* · *One workflow, end to end*.

**11 · FAQ** — 7 questions: How does discovery work? · Which platforms? · Self-serve or managed? · How are creators vetted? · What does it cost? · How do you handle data and privacy? · How do I get started?

**12 · Final CTA band** — legacy gradient. *"Ready to find your creators?"* → `Find Creators` · `Talk to us on WhatsApp`.

**13 · Footer** — Platform · For Brands · For Creators · Company · Resources · Legal. Contact block, socials, `© 2026 WebRectangle`.

---

### OTHER PAGES

| Page | Core message | Primary CTA |
|---|---|---|
| `/for-brands` | *"Find creators, launch campaigns, and manage collaborations from one place."* Sections: discover → create campaign → shortlist → invite → manage → track → measure. | `Start Your Campaign` |
| `/for-creators` | *"Get discovered by brands that actually fit your content."* Benefits: build profile, showcase portfolio, get discovered, receive structured invites, manage collabs, build campaign history. Address the creator's real fear: *"You'll get relevant briefs, not spam."* | `Join as a Creator` |
| `/how-it-works` | Full lifecycle, brand track and creator track side by side, with the campaign status pipeline visualised. | `Get Started` |
| `/discover` | The interactive demo at full scale. Filter rail (mobile: bottom-sheet drawer), creator grid, profile drawer, **creator comparison view** (2–3 side by side). URL-synced filters via `nuqs`/searchParams so results are shareable. Persistent `Sample data — real creator network launching soon` banner + a `Get early access` capture. | `Get Early Access` |
| `/pricing` | **No fake tiers.** Explain the two ways to work with us — **Self-serve** (you run it) and **Managed** (we run it) — then: *"We're in early access and pricing with our first brands directly. Tell us about your campaign and we'll give you a straight answer."* Honest and, at our stage, higher-converting than invented numbers. | `Talk to us` |
| `/about` | Brand story: *why "Rectangle"* — structure, precision, the building block every interface is made of; we bring that structure to a workflow that's currently chaos. Mission, vision, founders (Parth Maheshwari, Tarun), then **"Where we come from"** with the two real testimonials and four logos, honestly framed per §2. | `Work with us` |
| `/contact` | Email · WhatsApp · Schedule a meeting (Cal.com embed, env-gated) · **"We reply within 24 hours"** · Noida. Form: name, company, email, phone, `I am a… Brand / Creator / Other`, message. | — |
| `/resources` | MDX blog scaffold, tag filtering, reading time, ships with 2 genuinely useful posts (e.g. *"How to brief a creator properly"*, *"Engagement rate: what it actually tells you"*). SEO foundation. | — |
| `/join/brand`, `/join/creator` | Multi-step glass forms with progress, per-step validation, localStorage autosave. Fields per §36/§37 of our brand doc. | — |
| `/login` | Split-screen: form left, brand 3D right. Visual stub against a no-op auth adapter, structured so NextAuth drops in. | — |

---

## 9. QUALITY-OF-LIFE FEATURES

**Navigation & input**
- **⌘K command palette** (`cmdk`) — jump to any page, search creators in the demo, quick actions (`Contact`, `WhatsApp`, `Toggle theme`). Genuinely useful and signals "built by product people".
- Scroll progress bar (2px, brand gradient), sticky mobile CTA bar, `Back to top` after 80% scroll
- Full keyboard navigation, skip-to-content link, visible focus rings, correct tab order through the glass drawer
- Active-section nav highlighting (carry over the legacy scroll-spy, rewritten with IntersectionObserver)

**Forms**
- Inline Zod validation on blur, not on every keystroke
- `useFormStatus` pending states, optimistic success, `sonner` toast
- localStorage autosave on multi-step forms, restored with an "we saved your progress" notice
- Honeypot field + time-to-submit check + IP rate limiting; Turnstile wired behind an env flag
- Success state offers the WhatsApp deeplink as an immediate second channel

**Polish**
- Dark mode via `next-themes`, both palettes defined in tokens, no flash on load
- View Transitions API for route changes, with a graceful fallback
- Skeleton loaders for creator cards; `next/image` with blur placeholders; `content-visibility: auto` on below-fold sections
- Empty states and error states designed, not default
- Custom `404` using the isometric mark; `error.tsx` and `global-error.tsx`
- Copy-to-clipboard on the email address with toast confirmation

**Ops**
- `lib/services/analytics.ts` — provider-agnostic `track()`, env-gated (Plausible default, GA4 optional). No cookie banner needed if it stays cookieless — prefer that.
- `lib/services/notify.ts` as described in §7
- Structured console logging in dev; `Sentry` import commented and ready
- GitHub Action: typecheck → lint → build → Lighthouse CI against a budget

---

## 10. QUALITY BAR

**Accessibility — WCAG 2.2 AA, non-negotiable**
- 4.5:1 body / 3:1 large text, *verified against glass backgrounds*
- Semantic landmarks, one `h1` per page, logical heading order
- All interactive elements keyboard-reachable with visible focus; drawers and modals trap focus and restore it on close
- `aria-live` for async form results; every icon-only button has an accessible name
- Respect `prefers-reduced-motion` (kills 3D + reveals), `prefers-contrast`, `prefers-reduced-transparency`

**Performance budgets**
- Lighthouse ≥ 95 across the board on mobile
- LCP < 2.0s, INP < 200ms, CLS < 0.05 on mid-tier Android over 4G
- Initial JS ≤ 180 KB gz excluding the lazy 3D chunk; 3D chunk ≤ 150 KB gz
- Fonts self-hosted and preloaded; zero layout shift from font swap
- Every image sized, `next/image`, AVIF/WebP

**SEO**
- Per-page `generateMetadata`, canonicals, dynamic OG images via `next/og` using the brand lockup
- JSON-LD: `Organization`, `WebSite` + `SearchAction`, `FAQPage`, `BreadcrumbList`
- `sitemap.ts`, `robots.ts`
- Natural keyword coverage — *influencer marketing platform, influencer discovery, find influencers India, creator discovery, influencer campaign management, influencer outreach*. **Write for humans; no keyword stuffing.**

**Code quality**
- TypeScript strict, zero `any`, zero `@ts-ignore`
- **All copy in `lib/content/` as typed objects** — makes i18n and copy edits trivial and keeps JSX readable
- JSDoc on every exported function, component and type: what it does and *why it exists*
- File-header comments on non-obvious modules (repository adapters, the 3D scene, the glass system)
- Comment the *reasoning* behind constraints (e.g. why `backdrop-filter` count is capped), not what the line does
- ESLint + Prettier + `simple-import-sort`, all passing
- Conventional commits

---

## 11. COPY VOICE

Clear, modern, confident, human. Short sentences. Specific over clever.

| Write this | Not this |
|---|---|
| "Find 20 fitness creators in Delhi NCR with 20K–100K followers." | "Unlock the power of influencer discovery." |
| "AI narrows the field. You make the call." | "AI-powered next-generation matching engine." |
| "We reply within 24 hours." | "Our team is standing by to accelerate your journey." |
| "Sample data — our creator network is onboarding now." | "Join thousands of happy brands!" |

Indian-English conventions where natural (₹, lakh, Delhi NCR). Never claim a number we can't back.

---

## 12. BUILD ORDER

Work in this sequence and show me the result at each milestone:

1. **Foundation** — Next.js + TS + Tailwind v4, `tokens.css`, `lib/env.ts`, fonts, base layout
2. **Design system** — `components/ui/*` and `components/brand/*`, plus a dev-only `/kitchen-sink` route rendering every component in light and dark. Build this before any page.
3. **Data layer** — types, Zod schemas, repository interfaces, memory adapter, seed data, Prisma schema
4. **Layout shell** — Header, mobile drawer, Footer, WhatsApp FAB, scroll progress, command palette
5. **Homepage** — 2D first, all sections, static isometric SVG in the hero slot
6. **3D hero** — swap in the R3F scene behind the gate, verify the fallback ladder and the perf budget
7. **Remaining pages** — `/discover` first (highest product value), then the rest
8. **Forms + API + Server Actions**, end-to-end with no backend configured
9. **Polish pass** — a11y audit, Lighthouse, dark mode, empty/error states, reduced-motion verification
10. **Docs** — `README.md` (setup, architecture, how to swap in a real DB, how to deploy), `.env.example`, `Dockerfile`

---

## 13. DEFINITION OF DONE

- [ ] `pnpm dev` works immediately after clone with **no env vars set** — every form still captures and confirms
- [ ] Setting `DATABASE_URL` + switching one adapter line moves to a real database with **zero component changes**
- [ ] Lighthouse ≥ 95 mobile on `/`
- [ ] Zero fabricated statistics, testimonials, logos or pricing anywhere in the codebase
- [ ] Every AI/roadmap feature carries an honest `StatusBadge`
- [ ] All demo data visibly labelled as a product preview
- [ ] 3D degrades gracefully across the full fallback ladder; site is fully usable with WebGL disabled
- [ ] Keyboard-only navigation completes every flow
- [ ] Dark mode complete, no flash, contrast verified on glass in both themes
- [ ] The legacy logo lockup, `.hl` highlight, eyebrow square, CTA arrow, check bullet, FAQ `+`, CTA band and WhatsApp FAB are all present and recognisable

---

## 14. HOW TO WORK

Think like a co-founder, not a contractor. If something in this brief is wrong, over-scoped for a pre-launch startup, or would hurt conversion — **say so and propose the better option before building it**. If you hit a genuine fork, pick the simpler path, build it, and flag the trade-off.

Start by telling me your plan and the component inventory you intend to build. Then build.
