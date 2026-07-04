import { groq } from 'next-sanity'

export const categoriesQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    slug,
    "image": image.asset->url
  }
`

export const productsQuery = groq`
  *[_type == "product"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    "images": images[].asset->url,
    category -> {
      name,
      "slug": slug.current
    },
    colors,
    sizes,
    stock,
    stockQuantity,
    featured,
    badges
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    "images": images[].asset->url,
    category -> {
      name,
      "slug": slug.current
    },
    colors,
    sizes,
    stock,
    stockQuantity,
    featured,
    badges
  }
`

export const productsByBadgeQuery = groq`
  *[_type == "product" && badges match $badge] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    "images": images[].asset->url,
    category -> {
      name,
      "slug": slug.current
    },
    colors,
    sizes,
    stock,
    stockQuantity,
    featured,
    badges
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(name asc)[0...8] {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    "images": images[].asset->url,
    category -> {
      name,
      "slug": slug.current
    },
    colors,
    sizes,
    stock,
    stockQuantity,
    featured,
    badges
  }
`