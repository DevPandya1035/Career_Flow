#!/bin/sh
set -e

echo "🚀 CareerFlow Production Entrypoint starting..."

# Auto-configure Prisma provider if connecting to PostgreSQL
if echo "$DATABASE_URL" | grep -q "^postgres"; then
  echo "🐘 PostgreSQL database detected, updating Prisma schema provider..."
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  npx prisma generate
fi

# Ensure database schema is synchronized
echo "📦 Running Prisma db push..."
npx prisma db push --skip-generate || echo "⚠️ Warning: Prisma db push encountered an issue, proceeding..."

# Seed initial jobs and student if database is empty
echo "🌱 Checking seed data..."
npx tsx prisma/seed.ts || echo "⚠️ Warning: Seed script encountered an issue, proceeding..."

echo "⚡ Starting CareerFlow API & Web Server on port ${PORT:-5001}..."
exec npx tsx server/src/index.ts
