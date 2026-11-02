import { loadEnvFile } from 'node:process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
loadEnvFile(join(projectRoot, '.env.local'))

const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const dryRun = process.argv.includes('--dry-run')

const client = createClient({
  projectId: 'l9jivley',
  dataset: 'production',
  apiVersion: '2026-06-28',
  token,
  useCdn: false,
  perspective: 'published',
})

const categories = await client.fetch(
  `*[_type == "category"] {
    _id,
    name,
    "origin": coalesce(origin, "thrivers"),
    order
  }`
)

const hasOrder = (category) =>
  typeof category.order === 'number' && Number.isFinite(category.order)

const byName = (a, b) => a.name.localeCompare(b.name, 'en')

const groups = new Map()

for (const category of categories) {
  const origin = category.origin || 'thrivers'
  const group = groups.get(origin) || []
  group.push(category)
  groups.set(origin, group)
}

const patches = []

for (const [origin, group] of [...groups.entries()].sort(([a], [b]) =>
  a.localeCompare(b)
)) {
  const ordered = group.filter(hasOrder)
  const missing = group.filter((category) => !hasOrder(category)).sort(byName)

  if (missing.length === 0) continue

  const maxOrder = ordered.reduce(
    (max, category) => Math.max(max, category.order),
    0
  )
  let nextOrder = ordered.length ? Math.floor(maxOrder / 10) * 10 + 10 : 10

  console.log(
    `${origin}: ${missing.length} categories need an order${
      ordered.length ? ` (starting after ${maxOrder})` : ''
    }`
  )

  for (const category of missing) {
    patches.push({ _id: category._id, order: nextOrder })
    console.log(`  ${String(nextOrder).padStart(3, ' ')}  ${category.name}`)
    nextOrder += 10
  }
}

if (patches.length === 0) {
  console.log('All categories already have an order.')
  process.exit(0)
}

if (dryRun) {
  console.log(`Dry run: ${patches.length} categories would be patched.`)
  process.exit(0)
}

const transaction = client.transaction()

for (const patch of patches) {
  transaction.patch(patch._id, (current) =>
    current.set({ order: patch.order })
  )
}

await transaction.commit()

console.log(`Patched ${patches.length} categories with an order.`)
