# ==============================================================================
# CareerFlow Production Multi-Stage Dockerfile
# Stage 1: Build the React SPA frontend and generate Prisma client
# Stage 2: Lean Node.js runtime serving Express API + static SPA
# ==============================================================================

# ---- Stage 1: Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies (OpenSSL is required for Prisma engines)
RUN apk add --no-cache openssl

# Install dependencies based on package-lock.json
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy full application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the frontend production bundle (outputs to /app/dist)
RUN npm run build

# ---- Stage 2: Production Runtime ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Install runtime OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and package manifests
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy generated Prisma client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built frontend assets (dist/)
COPY --from=builder /app/dist ./dist

# Copy backend server source and shared lib
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/lib ./src/lib
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/src/types ./src/types

# Set permissions for non-root user
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

# Start the unified backend server
CMD ["npx", "tsx", "server/src/index.ts"]
