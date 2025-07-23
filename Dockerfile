# Path: /Dockerfile
# Multi-stage build for Next.js frontend

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# ⭐ แก้ไข: Copy lock files แบบ optional (ถ้ามี)
# แทนที่จะ copy ทุกไฟล์ให้ copy เฉพาะที่มีอยู่จริง
COPY package-lock.json* ./
# หรือถ้าใช้ yarn/pnpm ให้เพิ่มบรรทัดนี้
# COPY yarn.lock* pnpm-lock.yaml* ./

# Install dependencies based on available lock file
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "No lockfile found, running npm install" && npm install; \
  fi

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else echo "Running npm run build" && npm run build; \
  fi

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permissions for precompiled dependencies
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# ⭐ Copy standalone files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ⭐ Copy healthcheck script (สร้างในขั้นตอนถัดไป)
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# ⭐ Start the application
CMD ["node", "server.js"]