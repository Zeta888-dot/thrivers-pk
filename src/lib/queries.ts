import { groq } from 'next-sanity'

export const productsQuery = groq`
  *[_type == "product"] {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    "images": images[].asset->url,
    colors,
    sizes,
    stock,
    stockQuantity,
    featured,
    badges,
    collections,
    category-> {
      name,
      slug
    }
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    description,
    "images": images[].asset->url,
    colors,
    sizes,
    stock,
    stockQuantity,
    badges,
    category-> {
      name,
      slug
    }
  }
`

export const categoriesQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    slug,
    "image": image.asset->url
  }
`

export const productsByBadgeQuery = groq`
  *[_type == "product" && $badge in badges] {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    "images": images[].asset->url,
    colors,
    sizes,
    stock,
    stockQuantity,
    badges,
    category-> {
      name,
      slug
    }
  }
`