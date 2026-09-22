'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { client, sanityImg } from '@/lib/sanity'
import { categoriesQuery, productsQuery, productsByBadgeQuery, heroQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import ScribbleLogo from '@/components/ScribbleLogo'

interface Hero {
  title: string
  subtitle: string
  desktopImages: { url: string; alt: string }[]
  mobileImages: { url: string; alt: string }[]
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  overlayColor: string
  overlayOpacity: number
}

interface Category {
  _id: string
  name: string
  slug: string
  image?: string
}

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: string[]
  colors?: string[]
  sizes?: string[]
  stock?: string
  stockQuantity?: number
  featured?: boolean
  badges?: string[]
  category?: { name: string; slug: string }
}

/* Module level - HomePage ke bahar, warna har re-render pe remount hoga */
function ProductSection({
  title,
  products,
  viewAllHref,
  loading,
}: {
  title: string
  products: Product[]
  viewAllHref: string
  loading: boolean
}) {
  return (
    <section className="py-10 md:py-20">
      {/* Section heading - thora indent jaisa northstory text */}
      <div className="px-3 md:px-6 mb-6 md:mb-10 flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {products.length > 4 && (
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1.5 gap-y-10 md:gap-x-2 md:gap-y-16 px-1.5 md:px-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-200/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Full-bleed grid - northstory jaisa, koi gap nahi */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1.5 gap-y-10 md:gap-x-2 md:gap-y-16 px-1.5 md:px-3">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">No products in this section yet.</div>
          )}
        </>
      )}
    </section>
  )
}

export default function HomePage() {
  const [hero, setHero] = useState<Hero | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroData, catsData, productsData, newArrivalsData, bestSellersData, saleData] = await Promise.all([
          client.fetch(heroQuery),
          client.fetch(categoriesQuery),
          client.fetch(productsQuery),
          client.fetch(productsByBadgeQuery, { badge: 'New Arrival' }),
          client.fetch(productsByBadgeQuery, { badge: 'Best Seller' }),
          client.fetch(productsByBadgeQuery, { badge: 'Sale' }),
        ])

        setHero(heroData)

        const CATEGORY_ORDER = ['T-Shirts', 'Crochet Shirts', 'Trousers', 'Formals']

        const normalizedCategories = catsData.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug?.current || cat.slug || '',
          image: cat.image,
        }))

        normalizedCategories.sort((a: Category, b: Category) => {
          const aIndex = CATEGORY_ORDER.findIndex((o) => o.toLowerCase() === a.name.toLowerCase())
          const bIndex = CATEGORY_ORDER.findIndex((o) => o.toLowerCase() === b.name.toLowerCase())
          const aRank = aIndex === -1 ? CATEGORY_ORDER.length : aIndex
          const bRank = bIndex === -1 ? CATEGORY_ORDER.length : bIndex
          return aRank - bRank
        })

        setCategories(normalizedCategories)

        const normalize = (p: any) => ({
          ...p,
          slug: p.slug.current,
          category: p.category
            ? { name: p.category.name, slug: p.category.slug.current }
            : undefined,
        })

        setNewArrivals(newArrivalsData.map(normalize))
        setBestSellers(bestSellersData.map(normalize))
        setSaleProducts(saleData.map(normalize))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeImages = isMobile ? hero?.mobileImages : hero?.desktopImages
  const maxSlides = activeImages?.length || 1

  useEffect(() => {
    if (maxSlides <= 1) return
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % maxSlides), 5000)
    return () => clearInterval(t)
  }, [maxSlides])

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    if (distance > 50) setCurrentSlide((p) => (p + 1) % maxSlides)
    if (distance < -50) setCurrentSlide((p) => (p - 1 + maxSlides) % maxSlides)
    setTouchStartX(0)
    setTouchEndX(0)
  }

  return (
      <div className="bg-[#f7f7f5] -mt-[105px]">
      {/* Full-bleed hero - northstory style */}
      {hero ? (
        <section
          className="relative w-full h-[92vh] md:h-screen overflow-hidden bg-[#111]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeImages && activeImages.length > 0 && activeImages[currentSlide] && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sanityImg(activeImages[currentSlide]?.url, 1600)}
                  alt={activeImages[currentSlide]?.alt || hero?.title || 'Thrivers'}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Scribble brand mark overlay - northstory jaisa */}
          <div className="absolute top-24 left-6 md:left-10 xl:left-16 z-10">
            <ScribbleLogo className="h-16 md:h-24 w-auto text-white drop-shadow-lg" />
          </div>
        </section>
      ) : (
        <section className="w-full h-[92vh] md:h-screen bg-[#111]" />
      )}

      {/* Minimal category strip */}
      {categories.length > 0 && (
        <div className="border-b border-gray-200 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 md:gap-12 px-4 md:px-10 xl:px-16 w-max">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="text-xs md:text-sm font-semibold tracking-widest uppercase text-gray-900 hover:text-gray-500 whitespace-nowrap transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New Drops */}
      <ProductSection
        title="New Drops"
        products={newArrivals}
        viewAllHref="/shop?badge=New%20Arrival"
        loading={loading}
      />

      {bestSellers.length > 0 && (
        <ProductSection
          title="Best Sellers"
          products={bestSellers}
          viewAllHref="/shop?badge=Best%20Seller"
          loading={loading}
        />
      )}

      {saleProducts.length > 0 && (
        <ProductSection
          title="On Sale"
          products={saleProducts}
          viewAllHref="/shop?badge=Sale"
          loading={loading}
        />
      )}
    </div>
  )
}