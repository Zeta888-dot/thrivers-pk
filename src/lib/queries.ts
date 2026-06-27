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