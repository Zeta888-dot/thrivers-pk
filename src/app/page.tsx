'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { client, sanityImg } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/sanity'
import { categoriesQuery, productsQuery, productsByBadgeQuery, heroQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
// import ScribbleLogo from '@/components/ScribbleLogo'

interface HeroTileImage {
  alt?: string
  asset?: { _ref?: string }
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

interface HeroTile {
  title?: string
  tagline?: string
  body?: string
  image?: HeroTileImage | null
  link?: string
  overlayOpacity?: number
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
  origin?: string
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
  const title = tile?.title?.trim() || fallbackTitle
  const tagline = tile?.tagline?.trim()
  const body = tile?.body?.trim()
  const href = tile?.link || fallbackLink
  const image = tile?.image
  const overlayOpacity = Math.min(100, Math.max(0, tile?.overlayOpacity ?? 70)) / 100
  const imageSrc = image?.asset?._ref
    ? urlFor(image)
        .width(isMobile ? 900 : 1600)
        .height(isMobile ? 675 : 900)
        .fit('crop')
        .auto('format')
        .quality(80)
        .url()
    : null

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] min-h-[220px] w-full overflow-hidden bg-[#151515] md:aspect-auto md:h-[38vh] md:min-h-[280px]"
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={image?.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* readability gradient - bottom to top */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,${Math.min(
            0.9,
            overlayOpacity * 0.7
          )}) 45%, rgba(0,0,0,0.05) 100%)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start p-5 sm:p-6 md:p-8 lg:p-10">
        {tagline && (
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 md:text-xs">
            {tagline}
          </p>
        )}
        <h3 className="max-w-[92%] text-2xl font-semibold leading-[1.05] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h3>
        {body && (
          <p className="mt-2 line-clamp-3 max-w-[92%] text-xs leading-relaxed text-white/70 md:mt-3 md:text-sm">
            {body}
          </p>
        )}
        <span className="mt-4 inline-flex w-fit items-center gap-2 border border-white/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black md:mt-5 md:px-4 md:py-2 md:text-xs">
          Explore
          <ArrowRight size={14} weight="light" />
        </span>
      </div>
    </Link>
  )
}

function LineSelectorCard({
  title,
  image,
  selected,
  comingSoon,
  onClick,
}: {
  title: string
  image: { src: string; alt: string } | null
  selected: boolean
  comingSoon: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative block w-full overflow-hidden text-left transition-all duration-300 ${
        selected
          ? 'ring-2 ring-black ring-offset-2 ring-offset-[#f7f7f5]'
          : 'ring-1 ring-black/10 hover:ring-black/30'
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-[#1a1a1a] md:aspect-[2.2/1]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 50vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2b2b2b] to-[#111]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {comingSoon && (
          <span className="absolute right-2 top-2 border border-white/30 bg-black/30 px-1.5 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm md:right-3 md:top-3 md:px-2 md:text-[10px]">
            Coming soon
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4 md:p-6">
          <div className="min-w-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/65 md:text-[10px]">
              Collection
            </p>
            <h3 className="mt-1 text-sm font-semibold leading-tight tracking-tight text-white sm:text-base md:text-2xl">
              {title}
            </h3>
          </div>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors md:h-9 md:w-9 ${
              selected
                ? 'border-white bg-white text-black'
                : 'border-white/50 text-white group-hover:border-white'
            }`}
          >
            {selected ? <Check size={13} weight="light" /> : <ArrowRight size={13} weight="light" />}
          </span>
        </div>
      </div>
    </button>
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
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingCartSimpleIcon size={40} weight="light" className="mb-3" />
              <span>No products in this section yet.</span>
            </div>
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
  const [thriversProducts, setThriversProducts] = useState<Product[]>([])
  const [chitralProducts, setChitralProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLine, setSelectedLine] = useState<'thrivers' | 'chitral_special'>('thrivers')
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

        const normalizedCategories = catsData.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug?.current || cat.slug || '',
          origin: cat.origin || 'thrivers',
          image: cat.image,
        }))

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
        setThriversProducts(
          productsData
            .filter((p: { origin?: string }) => p.origin === 'thrivers')
            .map(normalize)
        )
        setChitralProducts(
          productsData
            .filter((p: { origin?: string }) => p.origin === 'chitral_special')
            .map(normalize)
        )
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

  const thriversCategories = categories.filter(
    (category) => (category.origin || 'thrivers') === 'thrivers'
  )
  const chitralCategories = categories.filter(
    (category) => (category.origin || 'thrivers') === 'chitral_special'
  )
  const selectedCategories =
    selectedLine === 'chitral_special' ? chitralCategories : thriversCategories
  const chitralComingSoon =
    !loading && (chitralProducts.length === 0 || chitralCategories.length === 0)

  const lineImage = (line: 'thrivers' | 'chitral_special') => {
    const lineCategories = line === 'chitral_special' ? chitralCategories : thriversCategories
    const categoryWithImage = lineCategories.find((category) => category.image)

    if (categoryWithImage?.image) {
      return {
        src: sanityImg(categoryWithImage.image, 1200),
        alt: categoryWithImage.name,
      }
    }

    const tile = line === 'chitral_special' ? hero?.chitralTile : hero?.originalsTile
    const tileImage = tile?.image

    if (tileImage?.asset?._ref) {
      return {
        src: urlFor(tileImage)
          .width(1200)
          .height(800)
          .fit('crop')
          .auto('format')
          .quality(80)
          .url(),
        alt:
          tileImage.alt ||
          tile?.title ||
          (line === 'chitral_special' ? 'Chitral Special' : 'Thrivers Products'),
      }
    }

    return null
  }

  return (
    <div className="bg-[#f7f7f5] -mt-[105px]">
      {/* Hero: slider on top, two tiles below (Thrivers Originals | Chitral Special) */}
      <section className="w-full bg-[#111]">
        {/* Main hero slider */}
        <div
          className="relative h-[52vh] min-h-[360px] overflow-hidden md:h-[60vh] md:min-h-[440px]"
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
                <ArrowLeft weight="light" className="w-7 h-7 md:w-9 md:h-9" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-white drop-shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
              >
                <ArrowRight weight="light" className="w-7 h-7 md:w-9 md:h-9" />
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

        {/* Bottom tiles: side by side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 gap-px bg-white/90 md:grid-cols-2">
          <HeroTileCard
            tile={hero?.originalsTile}
            fallbackTitle="Thrivers Originals"
            fallbackLink="/shop"
            isMobile={isMobile}
          />
          <HeroTileCard
            tile={hero?.chitralTile}
            fallbackTitle="Chitral Special"
            fallbackLink="/shop?origin=chitral_special"
            isMobile={isMobile}
          />
        </div>
      </section>

      {/* Product Lines */}
      <ProductSection
        title="Thrivers Products"
        products={thriversProducts}
        viewAllHref="/shop?origin=thrivers"
        loading={loading}
      />

      {chitralProducts.length > 0 && (
        <ProductSection
          title="Chitral Special"
          products={chitralProducts}
          viewAllHref="/shop?origin=chitral-special"
          loading={loading}
        />
      )}

      {/* Shop by Category - line selector + categories */}
      <section className="pt-4 md:pt-6 pb-5 md:pb-8">
        <div className="px-3 md:px-6 mb-3 md:mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              Choose a collection, then explore its categories.
            </p>
          </div>
          <Link
            href={`/shop?origin=${selectedLine}`}
            className="shrink-0 text-xs font-medium text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-500 md:text-sm"
          >
            View all
          </Link>
        </div>

        <div className="px-3 md:px-6 grid grid-cols-2 gap-2 md:gap-4">
          <LineSelectorCard
            title="Thrivers Products"
            image={lineImage('thrivers')}
            selected={selectedLine === 'thrivers'}
            comingSoon={false}
            onClick={() => setSelectedLine('thrivers')}
          />
          <LineSelectorCard
            title="Chitral Special"
            image={lineImage('chitral_special')}
            selected={selectedLine === 'chitral_special'}
            comingSoon={chitralComingSoon}
            onClick={() => setSelectedLine('chitral_special')}
          />
        </div>

        <div className="px-3 md:px-6 mt-5 md:mt-7">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="text-sm font-medium text-gray-900 md:text-base">
              {selectedLine === 'chitral_special'
                ? 'Chitral Special Categories'
                : 'Thrivers Categories'}
            </h3>
            {!loading && !(selectedLine === 'chitral_special' && chitralComingSoon) && (
              <span className="text-xs text-gray-500">{selectedCategories.length} categories</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-4 md:gap-x-4 md:gap-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-200/70 animate-pulse" />
              ))}
            </div>
          ) : selectedLine === 'chitral_special' && chitralComingSoon ? (
            <div className="border border-dashed border-black/10 bg-white/40 px-4 py-8 text-center md:py-10">
              <p className="text-sm font-medium text-gray-900 md:text-base">
                Chitral Special categories are coming soon.
              </p>
              <p className="mt-1 text-xs text-gray-500 md:text-sm">
                New categories will appear here as the collection grows.
              </p>
              {chitralProducts.length > 0 && (
                <Link
                  href="/shop?origin=chitral_special"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-500 md:text-sm"
                >
                  Browse Chitral Special
                  <ArrowRight size={13} weight="light" />
                </Link>
              )}
            </div>
          ) : selectedCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-4 md:gap-x-4 md:gap-y-6">
              {selectedCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/shop?origin=${selectedLine}&category=${encodeURIComponent(category.slug)}`}
                  className="group min-w-0"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e4e2]">
                    {category.image ? (
                      <Image
                        src={sanityImg(category.image, 700)}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-3 text-center text-sm text-gray-500">
                        {category.name}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="truncate text-sm text-gray-800 md:text-[15px]">{category.name}</span>
                    <ArrowRight
                      size={13}
                      weight="light"
                      className="shrink-0 text-gray-500 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-black/10 bg-white/40 px-4 py-8 text-center text-sm text-gray-500">
              No categories yet.
            </div>
          )}
        </div>
      </section>

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