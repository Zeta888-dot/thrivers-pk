import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'l9jivley',
  dataset: 'production',
  apiVersion: '2026-06-28',
  useCdn: true,
})