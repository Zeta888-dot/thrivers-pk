import { groq } from 'next-sanity'

// Shared projection: product ke saare fields ek jagah, taake queries sync rahein
const productFields = `
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
  unavailableSizes,
  stock,
  stockQuantity,
  featured,
  badges,
  "origin": coalesce(origin, "thrivers")
`

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
    ${productFields}
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productFields}
  }
`

export const productsByBadgeQuery = groq`
  *[_type == "product" && badges match $badge] | order(name asc) {
    ${productFields}
  }
`

// $origin = "thrivers" ya "chitral_special" (purane products bina origin ke thrivers count hote hain)
export const productsByOriginQuery = groq`
  *[_type == "product" && coalesce(origin, "thrivers") == $origin] | order(name asc) {
    ${productFields}
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(name asc)[0...8] {
    ${productFields}
  }
`

export const heroQuery = groq`
  *[_type == "hero"][0] {
    _id,
    title,
    subtitle,
    "desktopImages": desktopImages[] {
      "url": asset->url,
      "alt": alt
    },
    "mobileImages": mobileImages[] {
      "url": asset->url,
      "alt": alt
    },
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    overlayColor,
    overlayOpacity,
    "originalsTile": originalsTile {
      title,
      tagline,
      "imageUrl": image.asset->url,
      "mobileImageUrl": mobileImage.asset->url,
      link
    },
    "chitralTile": chitralTile {
      title,
      tagline,
      "imageUrl": image.asset->url,
      "mobileImageUrl": mobileImage.asset->url,
      link
    }
  }
`
