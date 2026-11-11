import { groq } from 'next-sanity'

// Shared projection: product ke saare fields ek jagah, taake queries sync rahein
const productFields = `
  _id,
  _createdAt,
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
  collections,
  tags,
  "origin": coalesce(origin, "thrivers")
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(coalesce(order, 999999999) asc, name asc) {
    _id,
    name,
    slug,
    description,
    "origin": coalesce(origin, "thrivers"),
    "order": order,
    "image": image.asset->url,
    "imageAlt": image.alt
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
      body,
      "image": image {
        asset,
        hotspot,
        crop,
        alt
      },
      link,
      overlayOpacity
    },
    "chitralTile": chitralTile {
      title,
      tagline,
      body,
      "image": image {
        asset,
        hotspot,
        crop,
        alt
      },
      link,
      overlayOpacity
    },
    "collectionCards": collectionCards {
      "thrivers": thrivers {
        title,
        subtitle,
        link,
        comingSoon,
        badgeText,
        "image": image {
          asset,
          hotspot,
          crop,
          alt
        }
      },
      "chitral_special": chitral_special {
        title,
        subtitle,
        link,
        comingSoon,
        badgeText,
        "image": image {
          asset,
          hotspot,
          crop,
          alt
        }
      }
    }
  }
`
