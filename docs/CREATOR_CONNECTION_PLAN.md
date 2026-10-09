# WebRectangle — Creator Connection & Backend Architecture Plan

This document outlines the full architecture, lifecycle, and technical specifications for connecting creators to the **WebRectangle** influencer marketing platform.

---

## 1. Executive Summary

"Connecting Creators" encompasses two distinct dimensions:
1. **The Collaboration Lifecycle (Business & Workflow)**: How creators onboard, get verified, become discoverable to brands, receive campaign briefs, negotiate deliverables, and deliver content.
2. **Social Media & Technical Data Sync (APIs & OAuth)**: How creators connect their real Instagram and YouTube accounts to verify metrics (follower count, engagement rates, audience demographics) without fabricating proof.

---

## 2. Current Architecture & Recent Backend Additions

WebRectangle employs a **strict repository pattern** that isolates the user interface from data persistence:

```
[ Pages / Client Forms / API Routes ]
                  │
                  ▼
       [ lib/repositories facade ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[ memory.adapter ]    [ prisma.adapter ]
 (Seed data JSON)     (PostgreSQL Database)
```

### What was just implemented in this update:
1. **Prisma Client Installed & Generated**:
   - Installed `@prisma/client@6.19.3` matching `prisma@6.19.3`.
   - Ran `npx prisma generate` to generate type-safe client models for `Creator`, `Campaign`, `Deliverable`, `Invitation`, `Lead`, `WaitlistEntry`, and `Brand`.
2. **Campaign & Invitation Repositories**:
   - Added `CampaignRepository` and `InvitationRepository` interfaces to `lib/repositories/types.ts`.
   - Implemented in-memory support in `lib/repositories/memory.adapter.ts`.
   - Implemented Prisma database queries in `lib/repositories/prisma.adapter.ts`.
3. **New REST API Endpoints**:
   - `GET /api/creators/[id]` — Retrieve a creator profile by ID or handle (`@handle`).
   - `POST /api/creators/apply` — Structured creator onboarding application endpoint.
   - `GET /api/campaigns?brandId=...` & `POST /api/campaigns` — Brand campaign creation and management.
   - `GET /api/campaigns/[id]/invitations` & `POST /api/campaigns/[id]/invitations` — Brand sending collaboration briefs/invitations to creators.
   - `GET /api/creators/[id]/invitations` — Creator inbox to inspect collaboration invitations and campaign details.
   - `POST /api/invitations/[id]/respond` — Creator responds to invitation (`accepted`, `rejected`, or `changes-requested`).

---

## 3. The 6-Step Creator Connection Lifecycle

```mermaid
graph TD
    A[1. Creator Application /join/creator] --> B[2. Admin Queue /admin/submissions]
    B -->|Review & Fraud Check| C[3. Profile Published to /discover]
    C -->|Brand Search & Filter| D[4. Brand Sends Campaign Invitation]
    D --> E[5. Creator Inbox: Accept / Decline / Negotiate]
    E -->|Accepted| F[6. Deliverable Upload & Completion]
```

### Step 1: Creator Onboarding & Application
- **Entry Points**: `/join/creator` or `POST /api/creators/apply`.
- **Data Captured**:
  - Identity: Name, email, phone / WhatsApp.
  - Social handles: Primary platform (`instagram` or `youtube`), handle (e.g. `@aarav.builds`).
  - Niches: Category (e.g., `technology`, `fitness`), niche, city, region, languages.
  - Formats: Supported content types (`reel`, `post`, `story`, `video`, `short`).
  - Portfolio & Rates: Sample post URLs, bio, expected starting rate in INR.

### Step 2: Verification & Admin Ingestion
- Inbound applications land in `Lead` repository with `status: 'pending'`, `audience: 'creator'`.
- Notifications fire automatically to the team via Resend email, Slack webhook, and local logs.
- WebRectangle admin reviews the submission in `/admin/submissions/[id]`.
- Admin approves the creator and completes `/admin/submissions/[id]/publish`, which creates an active, verified record in the `Creator` repository.

### Step 3: Brand Discovery & Matching
- Real published creators immediately join the catalog on `/discover`.
- Brands filter creators by:
  - Platform (`instagram`, `youtube`)
  - Category & Niche
  - Follower Tier (`nano`, `micro`, `mid`, `macro`)
  - Engagement Rate & Location (City/Region)
  - Content Formats

### Step 4: Campaign Outreach & Collaboration Invitation
- A brand creates a campaign (`POST /api/campaigns`):
  - Objective: `awareness`, `product-launch`, `sales`, `ugc`, etc.
  - Deliverables: E.g., 2 Reels + 1 Story.
  - Budget: Stored in integer paise (e.g., `5000000` = ₹50,000).
- The brand invites the creator (`POST /api/campaigns/[id]/invitations`):
  - Sends campaign brief and personalized message.

### Step 5: Creator Response & Negotiation
- The creator views their incoming briefs (`GET /api/creators/[id]/invitations`).
- The creator responds (`POST /api/invitations/[id]/respond`):
  - **`accepted`**: Agrees to deliverables, rate, and timeline. Campaign advances.
  - **`rejected`**: Declines without penalty or friction.
  - **`changes-requested`**: Submits counter-proposal or requests brief modifications.

### Step 6: Content Delivery & Approval
- The creator submits drafts/links according to the `Deliverable` schedule.
- Brand reviews, requests revisions or approves.
- Campaign transitions from `in-progress` → `approved` → `completed`.

---

## 4. Connecting Real Social Accounts (OAuth & Live Data Sync)

To upgrade from self-reported data to verified, live platform data, WebRectangle can connect directly with Meta and Google APIs:

### A. Instagram Graph API (Meta for Developers)
*Connects Instagram Professional / Creator accounts to fetch real metrics.*

#### Prerequisites
1. Meta Developer App of type **Business**.
2. Meta App Review approved for permissions:
   - `instagram_basic`: Access username, profile picture, account ID.
   - `pages_show_list`: Enumerate Facebook pages connected to the creator's Instagram account.
   - `instagram_manage_insights`: Read follower count, reach, impressions, audience demographics.
3. The creator must have an **Instagram Business or Creator account** linked to a Facebook Page.

#### OAuth Flow
1. **Authorization URL**:
   ```
   https://www.facebook.com/v19.0/dialog/oauth?
     client_id={META_APP_ID}&
     redirect_uri={NEXT_PUBLIC_SITE_URL}/api/auth/instagram/callback&
     scope=instagram_basic,pages_show_list,instagram_manage_insights&
     response_type=code
   ```
2. **Token Exchange**:
   - Exchange `code` for a short-lived user token at `graph.facebook.com/v19.0/oauth/access_token`.
   - Exchange short-lived token for a **60-day long-lived access token** via `fb_exchange_token`.
3. **Data Fetching**:
   - Get Instagram Business Account ID:
     `GET /me/accounts?fields=instagram_business_account`
   - Get Profile Details:
     `GET /{instagram_account_id}?fields=username,name,biography,profile_picture_url,followers_count,media_count`
   - Get Demographics & Engagement Insights:
     `GET /{instagram_account_id}/insights?metric=audience_gender_age,audience_country,audience_city,impressions,reach&period=lifetime`
4. **Auto-populate Creator Fields**:
   - `followers`: Actual `followers_count`.
   - `primaryAgeBand` & `femaleShare`: Extracted directly from `audience_gender_age`.
   - `topLocations`: Top cities from `audience_city`.
   - Set `verifiedAt = new Date()`.

---

### B. YouTube Data API v3 (Google Cloud Platform)
*Connects YouTube channels to fetch subscriber counts and video metrics.*

#### Prerequisites
1. Google Cloud Project with **YouTube Data API v3** enabled.
2. OAuth 2.0 Client ID & Secret configured with authorized redirect URI:
   `{NEXT_PUBLIC_SITE_URL}/api/auth/youtube/callback`
3. Scope: `https://www.googleapis.com/auth/youtube.readonly`.

#### OAuth Flow
1. **Authorization URL**:
   ```
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id={GOOGLE_CLIENT_ID}&
     redirect_uri={NEXT_PUBLIC_SITE_URL}/api/auth/youtube/callback&
     response_type=code&
     scope=https://www.googleapis.com/auth/youtube.readonly&
     access_type=offline&
     prompt=consent
   ```
2. **Token Exchange**:
   - Exchange `code` for `access_token` and `refresh_token` at `oauth2.googleapis.com/token`.
3. **Data Fetching**:
   - Channel Statistics:
     `GET https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true`
   - Retrieve:
     - `statistics.subscriberCount` -> `followers`
     - `statistics.viewCount` -> total channel views
     - `statistics.videoCount` -> total video count
   - Recent Video Average Views:
     Query `playlistItems` of the channel's uploads playlist to calculate average views on last 10 videos -> `avgViews`.
   - Set `verifiedAt = new Date()`.

---

## 5. Activating the Production PostgreSQL Database

The codebase is built so that switching from the in-memory demo store to PostgreSQL requires **zero frontend code changes**:

1. Create a PostgreSQL database (e.g., Supabase, Neon, AWS RDS, or local Postgres).
2. Create `.env.local` with the database connection string:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/webrectangle?schema=public"
   ```
3. Push the schema to the database:
   ```bash
   npx prisma db push
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

`lib/repositories/index.ts` automatically detects `process.env.DATABASE_URL` and routes all creator, campaign, lead, and invitation operations to PostgreSQL.
