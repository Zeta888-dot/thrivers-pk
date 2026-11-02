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
})

const productIds = await client.fetch(
  `*[_type == "product" && !defined(origin)]._id`
)

const categoryIds = await client.fetch(
  `*[_type == "category" && !defined(origin)]._id`
)

if (dryRun) {
  console.log(
    `${productIds.length} products and ${categoryIds.length} categories would be patched.`
  )
  process.exit(0)
}

if (productIds.length === 0 && categoryIds.length === 0) {
  console.log('No products or categories need patching.')
  process.exit(0)
}

const transaction = client.transaction()

for (const id of productIds) {
  transaction.patch(id, (patch) => patch.set({ origin: 'thrivers' }))
}

for (const id of categoryIds) {
  transaction.patch(id, (patch) => patch.set({ origin: 'thrivers' }))
}

await transaction.commit()

console.log(
  `Patched ${productIds.length} products and ${categoryIds.length} categories with origin "thrivers".`
)
