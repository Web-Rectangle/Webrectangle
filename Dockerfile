# WebRectangle production image.
#
# Multi-stage so the runtime layer carries no source, no dev dependencies and
# no package manager. Relies on `output: 'standalone'` in next.config.ts, which
# traces the actual module graph and emits a minimal server bundle - typically
# a tenth the size of shipping node_modules.
#
# Vercel ignores this entirely and uses its own build pipeline. This exists for
# self-hosting: Fly, Railway, Cloud Run, or a plain VPS.
#
#   docker build -t webrectangle .
#   docker run -p 3000:3000 --env-file .env.local webrectangle

# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Copied separately from the source so this layer is only rebuilt when the
# dependency set actually changes, not on every code edit.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time only. NEXT_PUBLIC_* values are inlined into the client bundle
# during the build, so this must be the real production origin - overriding it
# at runtime has no effect on already-compiled output.
ARG NEXT_PUBLIC_SITE_URL="https://webrectangle.com"
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root, and created explicitly rather than reusing node:alpine's `node`
# user so the uid is stable across base image updates.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# The standalone output expects .next/static and public to sit beside it.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Uses the app's own health endpoint, which reports the active repository
# adapter as well as liveness.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
