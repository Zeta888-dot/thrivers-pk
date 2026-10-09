'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { client, sanityImg } from '@/lib/sanity'
import { categoriesQuery, productsQuery, productsByBadgeQuery, heroQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
// import ScribbleLogo from '@/components/ScribbleLogo'

interface HeroTile {
  title?: string
  tagline?: string
  imageUrl?: string
  mobileImageUrl?: string
  link?: string
}

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
  originalsTile?: HeroTile | null
  chitralTile?: HeroTile | null
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
  origin?: string
  category?: { name: string; slug: string }
}

function HeroTileCard({
  tile,
  fallbackTitle,
  fallbackLink,
  isMobile,
}: {
  tile?: HeroTile | null
  fallbackTitle: string
  fallbackLink: string
  isMobile: boolean
}) {
  const img = (isMobile && tile?.mobileImageUrl) || tile?.imageUrl
  const title = tile?.title || fallbackTitle
  const href = tile?.link || fallbackLink

  return (
    <Link href={href} className="group relative block h-full w-full overflow-hidden bg-[#1a1a1a]">
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sanityImg(img, 1000)}
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 md:p-8 lg:p-10">
        <h3 className="text-white text-base sm:text-xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
          {title}
        </h3>
        {tile?.tagline && (
          <p className="mt-0.5 md:mt-1 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.18em] text-white/80">
            {tile.tagline}
          </p>
        )}
        <span className="mt-2 md:mt-3 inline-flex w-fit items-center gap-1.5 border border-white/70 px-2.5 py-1 md:px-4 md:py-2 text-[10px] md:text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors group-hover:bg-white group-hover:text-black">
          Explore
          <ArrowRight size={12} className="md:w-[14px] md:h-[14px]" />
        </span>
      </div>
    </Link>
  )
}

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
    <section className="pt-0 pb-3 md:pb-6">
      <div className="px-3 md:px-6 mb-2 md:mb-3 flex items-end justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">{title}</h2>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-200/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
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

  // Autoplay: currentSlide dependency => manual next/prev ke baad timer dobara 5s se start
  useEffect(() => {
    if (maxSlides <= 1) return
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % maxSlides), 5000)
    return () => clearInterval(t)
  }, [maxSlides, currentSlide])

  const goNext = () => setCurrentSlide((p) => (p + 1) % maxSlides)
  const goPrev = () => setCurrentSlide((p) => (p - 1 + maxSlides) % maxSlides)

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    if (distance > 50) goNext()
    if (distance < -50) goPrev()
    setTouchStartX(0)
    setTouchEndX(0)
  }

  return (
    <div className="bg-[#f7f7f5] -mt-[105px]">
      {/* Hero: 75% slider on top, 25% split 50/50 (Thrivers Originals | Chitral Special) */}
      <section className="flex flex-col w-full h-[92vh] md:h-screen bg-[#111]">
        {/* Top 75%: main hero slider */}
        <div
          className="relative basis-3/4 min-h-0 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {hero && activeImages && activeImages.length > 0 && activeImages[currentSlide] && (
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

          {/* Prev / Next arrows */}
          {maxSlides > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 text-white drop-shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-7 h-7 md:w-9 md:h-9" strokeWidth={1.25} />
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-white drop-shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
              >
                <ArrowRight className="w-7 h-7 md:w-9 md:h-9" strokeWidth={1.25} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {Array.from({ length: maxSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* <div className="absolute top-24 left-6 md:left-10 xl:left-16 z-10">
            <ScribbleLogo className="h-16 md:h-24 w-auto text-white drop-shadow-lg" />
          </div> */}
        </div>

        {/* Bottom 25%: two tiles, 50/50 */}
        <div className="basis-1/4 min-h-0 grid grid-cols-2 gap-px bg-white/90">
          <HeroTileCard
            tile={hero?.originalsTile}
            fallbackTitle="Thrivers Originals"
            fallbackLink="/shop?origin=thrivers"
            isMobile={isMobile}
          />
          <HeroTileCard
            tile={hero?.chitralTile}
            fallbackTitle="Chitral Special"
            fallbackLink="/shop?origin=chitral-special"
            isMobile={isMobile}
          />
        </div>
      </section>

      {/* Shop by Category - horizontal swipe, attached, See all last */}
      {categories.length > 0 && (
        <section className="pt-1 md:pt-2 pb-3 md:pb-5">
          <div className="px-3 md:px-6 mb-2 md:mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="w-[46vw] md:w-[24vw] shrink-0 group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#e4e4e2]">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sanityImg(c.image, 600)}
                      alt={c.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      {c.name}
                    </div>
                  )}
                </div>
                <div className="pt-2 pl-3 text-[15px] md:text-base text-gray-800">{c.name}</div>
              </Link>
            ))}
            <Link href="/shop" className="w-[46vw] md:w-[24vw] shrink-0">
              <div className="aspect-[4/5] bg-[#e4e4e2] flex items-center justify-center hover:bg-[#dcdcd9] transition-colors">
                <span className="text-[15px] md:text-base font-semibold text-gray-900 underline underline-offset-4">
                  See all →
                </span>
              </div>
              <div className="pt-2" />
            </Link>
          </div>
        </section>
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