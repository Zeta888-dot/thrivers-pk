'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CaretLeft, CaretRight, ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import { useState, useEffect, useRef } from 'react'
import { client, freshClient, sanityImg } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/sanity'
import { categoriesQuery, productsQuery, heroQuery } from '@/lib/queries'
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

interface HeroCollectionCard extends HeroTile {
  subtitle?: string
  comingSoon?: boolean
  badgeText?: string
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
  collectionCards?: {
    thrivers?: HeroCollectionCard | null
    chitral_special?: HeroCollectionCard | null
  } | null
}

interface Category {
  _id: string
  name: string
  slug: string
  origin?: string
  image?: string
  imageAlt?: string
}

interface Product {
  _id: string
  _createdAt?: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: string[]
  colors?: string[]
  sizes?: string[]
  unavailableSizes?: string[]
  stock?: string
  stockQuantity?: number
  featured?: boolean
  badges?: string[]
  collections?: string[]
  tags?: string[]
  origin?: string
  category?: { name: string; slug: string }
}

function hexToRgba(hex: string | undefined, alpha: number) {
  const clean = (hex || '').replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const value = parseInt(full, 16)
  if (full.length !== 6 || Number.isNaN(value)) return `rgba(0, 0, 0, ${alpha})`
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
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
  const strength = Math.min(0.9, Math.max(0.35, (tile?.overlayOpacity ?? 70) / 100))
  const objectPosition = image?.hotspot
    ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`
    : '50% 25%'
  const imageSrc = image?.asset?._ref
    ? urlFor(image)
        .width(isMobile ? 900 : 1600)
        .height(isMobile ? 1125 : 900)
        .fit('crop')
        .auto('format')
        .quality(80)
        .url()
    : null

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] min-h-[300px] w-full overflow-hidden bg-[#151515] md:aspect-auto md:h-[42vh] md:min-h-[320px]"
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={image?.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectPosition }}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* Bottom-only gradient (top/faces clean) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,${strength}) 0%, rgba(0,0,0,${
            strength * 0.3
          }) 45%, rgba(0,0,0,0) 100%)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start p-5 md:p-8">
        {tagline && (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
            {tagline}
          </p>
        )}
        <h3 className="max-w-[92%] text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
          {title}
        </h3>
        {body && (
          <p className="mt-2 line-clamp-2 max-w-xs text-sm leading-relaxed text-white/75">
            {body}
          </p>
        )}
        <span className="mt-4 inline-flex h-10 w-fit items-center gap-2 border border-white/70 px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black md:text-xs">
          Explore
          <ArrowRight size={14} weight="light" />
        </span>
      </div>
    </Link>
  )
}

function LineSelectorCard({
  title,
  subtitle,
  image,
  selected,
  comingSoon,
  badgeText,
  onClick,
}: {
  title: string
  subtitle?: string
  image: { src: string; alt: string } | null
  selected: boolean
  comingSoon: boolean
  badgeText?: string
  onClick: () => void
}) {
  const badge = badgeText?.trim() || (comingSoon ? 'Coming soon' : '')
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative block w-full text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] ${
        selected ? 'opacity-100' : 'opacity-80 hover:opacity-100'
      }`}
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-[#1a1a1a] transition-all duration-300 md:aspect-[16/9] md:max-h-[420px] ${
          selected ? 'ring-2 ring-inset ring-white/90' : 'ring-0'
        }`}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 50vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2b2b2b] to-[#111]" />
        )}

        {/* Bottom gradient only */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

        {badge && (
          <span className="absolute right-2 top-2 border border-white/30 bg-black/30 px-1.5 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm md:right-3 md:top-3 md:px-2 md:text-[10px]">
            {badge}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 md:p-6">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              {subtitle?.trim() || 'Collection'}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-tight tracking-tight text-white md:text-2xl">
              {title}
            </h3>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black md:h-10 md:w-10">
            <ArrowRight size={14} weight="light" />
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
    <section className="py-12 md:py-20">
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
  const categoryScrollerRef = useRef<HTMLDivElement>(null)
  const categoryDrag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [categoryProgress, setCategoryProgress] = useState(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroData, catsData, productsData] = await Promise.all([
          freshClient.fetch(heroQuery),
          client.fetch(categoriesQuery),
          client.fetch(productsQuery),
        ])

        setHero(heroData)

        const normalizedCategories = catsData.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug?.current || cat.slug || '',
          origin: cat.origin || 'thrivers',
          image: cat.image,
          imageAlt: cat.imageAlt,
        }))

        setCategories(normalizedCategories)

        const normalize = (p: any): Product => ({
          ...p,
          slug: p.slug?.current || p.slug,
          category: p.category
            ? { name: p.category.name, slug: p.category.slug?.current || p.category.slug }
            : undefined,
        })

        const all: Product[] = (productsData as any[]).map(normalize)
        const newestFirst = [...all].sort(
          (a, b) => new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime()
        )
        const isNewBadge = (p: Product) =>
          (p.badges || []).some((b) => b.trim().toLowerCase().startsWith('new'))
        const onSale = (p: Product) => !!p.compareAtPrice && p.compareAtPrice > p.price

        setThriversProducts(all.filter((p) => p.origin === 'thrivers'))
        setChitralProducts(all.filter((p) => p.origin === 'chitral_special'))

        // New Drops: "New Arrival"-type badge first, fallback to newest products
        const flaggedNew = newestFirst.filter(isNewBadge)
        setNewArrivals((flaggedNew.length > 0 ? flaggedNew : newestFirst).slice(0, 8))

        // Best Sellers: featured products first, newest products fill the rest
        const featured = newestFirst.filter((p) => p.featured)
        const bestList = featured.length > 0 ? [...featured, ...newestFirst.filter((p) => !p.featured)] : newestFirst
        setBestSellers(bestList.slice(0, 8))

        // On Sale: compareAtPrice > price
        setSaleProducts(newestFirst.filter(onSale).slice(0, 8))
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
  const overlayHex = (hero?.overlayColor || '').trim()
  const overlayAlpha = Math.min(1, Math.max(0, hero?.overlayOpacity ?? 0))
  const hasColorOverlay = overlayHex.length > 0 && overlayAlpha > 0

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

  const thriversCard = hero?.collectionCards?.thrivers
  const chitralCard = hero?.collectionCards?.chitral_special

  // Image priority: collectionCards image -> hero bottom tile image -> neutral dark block
  const lineImage = (line: 'thrivers' | 'chitral_special') => {
    const card = line === 'chitral_special' ? chitralCard : thriversCard
    const cardImage = card?.image

    if (cardImage?.asset?._ref) {
      return {
        src: urlFor(cardImage)
          .width(1200)
          .height(800)
          .fit('crop')
          .auto('format')
          .quality(80)
          .url(),
        alt:
          cardImage.alt ||
          card?.title ||
          (line === 'chitral_special' ? 'Chitral Special' : 'Thrivers Originals'),
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
          (line === 'chitral_special' ? 'Chitral Special' : 'Thrivers Originals'),
      }
    }

    return null
  }

  const updateCategoryScroll = () => {
    const el = categoryScrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < max - 4)
    setCategoryProgress(max > 0 ? Math.min(1, el.scrollLeft / max) : 0)
  }

  const scrollCategories = (dir: 1 | -1) => {
    const el = categoryScrollerRef.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onCategoryPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined' || window.innerWidth < 768 || e.button !== 0) return
    const el = categoryScrollerRef.current
    if (!el) return
    categoryDrag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }
  }

  const onCategoryPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = categoryScrollerRef.current
    const drag = categoryDrag.current
    if (!el || !drag.active) return
    const dx = e.clientX - drag.startX
    if (Math.abs(dx) > 5) {
      drag.moved = true
      el.scrollLeft = drag.startLeft - dx
    }
  }

  const endCategoryDrag = () => {
    categoryDrag.current.active = false
  }

  const blockClickAfterDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (categoryDrag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      categoryDrag.current.moved = false
    }
  }

  useEffect(() => {
    updateCategoryScroll()
    const onResize = () => updateCategoryScroll()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, selectedLine, categories.length, thriversProducts.length, chitralProducts.length])

  const countForCategory = (slug: string) =>
    (selectedLine === 'chitral_special' ? chitralProducts : thriversProducts).filter(
      (p) => p.category?.slug === slug
    ).length

  return (
    <div className="bg-[#f7f7f5] -mt-[105px] pb-20 md:pb-6">
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

          {/* Overlay: sirf jab Sanity mein colour + opacity set ho, warna koi tint nahi */}
          {hasColorOverlay ? (
            <div
              className="pointer-events-none absolute inset-0 z-[5]"
              style={{
                backgroundImage: `linear-gradient(to top, ${hexToRgba(
                  overlayHex,
                  overlayAlpha
                )} 0%, ${hexToRgba(
                  overlayHex,
                  overlayAlpha * 0.45
                )} 45%, rgba(0,0,0,0) 100%)`,
              }}
            />
          ) : (
            /* Neutral readability gradient - sirf neeche, image ke upar nahi */
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
          )}

          {(hero?.title || hero?.subtitle || hero?.primaryButtonText) && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-end">
              <div className="w-[90%] px-6 pb-16 sm:w-[85%] md:w-auto md:max-w-xl md:px-12 md:pb-20 lg:px-16">
                {hero?.title && (
                  <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                    {hero.title}
                  </h1>
                )}
                {hero?.subtitle && (
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 drop-shadow-sm md:mt-3 md:text-base">
                    {hero.subtitle}
                  </p>
                )}
                {(hero?.primaryButtonText || hero?.secondaryButtonText) && (
                  <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-7">
                    {hero?.primaryButtonText && (
                      <Link
                        href={hero?.primaryButtonLink || '/shop'}
                        className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 bg-white px-6 text-xs font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
                      >
                        {hero.primaryButtonText}
                        <ArrowRight size={14} weight="light" />
                      </Link>
                    )}
                    {hero?.secondaryButtonText && (
                      <Link
                        href={hero?.secondaryButtonLink || '/about'}
                        className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 border border-white/80 px-6 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
                      >
                        {hero.secondaryButtonText}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prev / Next arrows */}
          {maxSlides > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 md:left-6"
              >
                <CaretLeft size={18} weight="light" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 md:right-6"
              >
                <CaretRight size={18} weight="light" />
              </button>

              {/* Line indicators */}
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-6">
                {Array.from({ length: maxSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === currentSlide}
                    className="flex h-6 items-center justify-center px-1"
                  >
                    <span
                      className={`block h-[2px] rounded-full transition-all duration-300 ${
                        i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  </button>
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

      {/* Shop by Category - line selector + categories */}
      <section className="py-12 md:py-20">
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
            className="shrink-0 text-sm font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-500"
          >
            View all
          </Link>
        </div>

        <div className="px-3 md:px-6 grid grid-cols-2 gap-2 md:gap-4">
          <LineSelectorCard
            title={thriversCard?.title?.trim() || 'Thrivers Originals'}
            subtitle={thriversCard?.subtitle}
            image={lineImage('thrivers')}
            selected={selectedLine === 'thrivers'}
            comingSoon={!!thriversCard?.comingSoon}
            badgeText={thriversCard?.badgeText}
            onClick={() => setSelectedLine('thrivers')}
          />
          <LineSelectorCard
            title={chitralCard?.title?.trim() || 'Chitral Special'}
            subtitle={chitralCard?.subtitle}
            image={lineImage('chitral_special')}
            selected={selectedLine === 'chitral_special'}
            comingSoon={!!chitralCard?.comingSoon || chitralComingSoon}
            badgeText={chitralCard?.badgeText}
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
            <div className="flex gap-4 overflow-hidden px-3 md:px-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] w-[72%] shrink-0 animate-pulse bg-gray-200/70 sm:w-[45%] md:w-[32%] lg:w-[24%]"
                />
              ))}
            </div>
          ) : selectedLine === 'chitral_special' && chitralComingSoon ? (
            <div className="mx-3 border border-dashed border-black/10 bg-white/40 px-4 py-8 text-center md:mx-6 md:py-10">
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
            <div className="relative">
              <button
                type="button"
                onClick={() => scrollCategories(-1)}
                aria-label="Previous categories"
                disabled={!canScrollLeft}
                className="absolute left-2 top-[40%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-gray-900 shadow-sm backdrop-blur transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 md:flex"
              >
                <CaretLeft size={18} weight="light" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories(1)}
                aria-label="Next categories"
                disabled={!canScrollRight}
                className="absolute right-2 top-[40%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-gray-900 shadow-sm backdrop-blur transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 md:flex"
              >
                <CaretRight size={18} weight="light" />
              </button>

              <div
                ref={categoryScrollerRef}
                key={selectedLine}
                role="region"
                aria-roledescription="carousel"
                aria-label={
                  selectedLine === 'chitral_special'
                    ? 'Chitral Special categories'
                    : 'Thrivers categories'
                }
                tabIndex={0}
                onScroll={updateCategoryScroll}
                onPointerDown={onCategoryPointerDown}
                onPointerMove={onCategoryPointerMove}
                onPointerUp={endCategoryDrag}
                onPointerCancel={endCategoryDrag}
                onPointerLeave={endCategoryDrag}
                onClickCapture={blockClickAfterDrag}
                className="animate-fade scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 md:cursor-grab md:active:cursor-grabbing md:px-6"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {selectedCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/shop?origin=${selectedLine}&category=${encodeURIComponent(category.slug)}`}
                    className="group relative w-[72%] shrink-0 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:w-[45%] md:w-[32%] lg:w-[24%]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e4e2]">
                      {category.image ? (
                        <Image
                          src={sanityImg(category.image, 800)}
                          alt={category.imageAlt || category.name}
                          fill
                          sizes="(max-width: 768px) 72vw, (max-width: 1024px) 40vw, 24vw"
                          draggable={false}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#dcdcd8] to-[#b9b9b3]" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white md:text-[15px]">
                            {category.name}
                          </p>
                          {countForCategory(category.slug) > 0 && (
                            <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/70">
                              {countForCategory(category.slug)} items
                            </p>
                          )}
                        </div>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black">
                          <ArrowRight size={13} weight="light" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-3 px-3 md:px-6">
                <div className="h-px w-full bg-black/10">
                  <div
                    className="h-px bg-gray-900 transition-[margin] duration-150"
                    style={{ width: '25%', marginLeft: `${categoryProgress * 75}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-3 border border-dashed border-black/10 bg-white/40 px-4 py-8 text-center text-sm text-gray-500 md:mx-6">
              No categories yet.
            </div>
          )}
        </div>
      </section>

      {/* Product Lines */}
      <ProductSection
        title="Thrivers Products"
        products={thriversProducts}
        viewAllHref="/shop?origin=thrivers"
        loading={loading}
      />

      {!loading && chitralProducts.length > 0 && (
        <ProductSection
          title="Chitral Special"
          products={chitralProducts}
          viewAllHref="/shop?origin=chitral_special"
          loading={loading}
        />
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