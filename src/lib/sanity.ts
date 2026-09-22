import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'l9jivley',
  dataset: 'production',
  apiVersion: '2026-06-28',
  useCdn: true,
})

// Sanity CDN image optimizer:
// - w = width (jitni zaroorat hai utni hi, bari file nahi)
// - q = quality 65 (webp mein kaafi clean)
// - auto=format = browser ko webp/avif serve karo (jpg se 3-4x chhoti)
// - fit=max = aspect ratio preserve
export const sanityImg = (url: string, w = 1000, q = 65) =>
  url ? `${url}?w=${w}&q=${q}&auto=format&fit=max` : url