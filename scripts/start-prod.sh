#!/bin/sh
set -e

echo "🚀 CareerFlow Production Entrypoint starting..."

# Ensure database schema is synchronized
echo "📦 Running Prisma db push..."
npx prisma db push --skip-generate || echo "⚠️ Warning: Prisma db push encountered an issue, proceeding..."

# Seed initial jobs and student if database is empty
echo "🌱 Checking seed data..."
npx tsx prisma/seed.ts || echo "⚠️ Warning: Seed script encountered an issue, proceeding..."

echo "⚡ Starting CareerFlow API & Web Server on port ${PORT:-5001}..."
exec npx tsx server/src/index.ts
