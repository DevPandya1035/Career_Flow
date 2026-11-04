#!/usr/bin/env node

/**
 * CareerFlow Database Provider Switcher
 * Switches prisma/schema.prisma between "sqlite" (local dev) and "postgresql" (AWS RDS).
 * Usage:
 *   node scripts/switch-db.js postgresql
 *   node scripts/switch-db.js sqlite
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma')

const target = process.argv[2]?.toLowerCase()

if (!target || !['sqlite', 'postgresql', 'postgres'].includes(target)) {
  console.error('❌ Please specify a valid provider: "sqlite" or "postgresql"')
  console.log('Usage: node scripts/switch-db.js [sqlite|postgresql]')
  process.exit(1)
}

const provider = target === 'postgres' ? 'postgresql' : target

let content = fs.readFileSync(schemaPath, 'utf8')
const updated = content.replace(
  /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"[^"]+"/,
  `datasource db {\n  provider = "${provider}"`
)

if (content === updated) {
  console.log(`ℹ️ Prisma schema is already set to provider: "${provider}"`)
} else {
  fs.writeFileSync(schemaPath, updated, 'utf8')
  console.log(`✅ Updated prisma/schema.prisma datasource provider to: "${provider}"`)
}

console.log('🔄 Regenerating Prisma client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log(`🎉 Successfully configured for ${provider}!`)
} catch (err) {
  console.error('Failed to regenerate prisma client:', err.message)
}
