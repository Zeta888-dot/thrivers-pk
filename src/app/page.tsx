'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { client } from '@/lib/sanity'
import { categoriesQuery, productsQuery, productsByBadgeQuery, heroQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import Image from 'next/image'

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
  featured?: boolean
  badges?: string[]
  category?: {
    name: string
    slug: string
  }
}

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hero, setHero] = useState<Hero | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
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
        
        const normalizedCategories = catsData.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug?.current || cat.slug || '',
          image: cat.image
        }))
        setCategories(normalizedCategories)
        
        const normalizedProducts = productsData.map((p: any) => ({
          ...p,
          slug: p.slug.current,
          category: p.category ? {
            name: p.category.name,
            slug: p.category.slug.current
          } : undefined
        }))
        
        const normalize = (p: any) => ({
          ...p,
          slug: p.slug.current,
          category: p.category ? {
            name: p.category.name,
            slug: p.category.slug.current
          } : undefined
        })
        
        setNewArrivals(newArrivalsData.map(normalize))
        setBestSellers(bestSellersData.map(normalize))
        setSaleProducts(saleData.map(normalize))
        
        const featured = normalizedProducts.filter((p: Product) => p.featured).slice(0, 8)
        setFeaturedProducts(featured)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeImages = isMobile ? hero?.mobileImages : hero?.desktopImages
  const maxSlides = activeImages?.length || 1

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
    
    setTouchStartX(0)
    setTouchEndX(0)
  }

  const nextSlide = () => { if (maxSlides <= 1) return; setCurrentSlide(p => (p + 1) % maxSlides) }
  const prevSlide = () => { if (maxSlides <= 1) return; setCurrentSlide(p => (p - 1 + maxSlides) % maxSlides) }
  const goToSlide = (index: number) => { setCurrentSlide(index) }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const ProductSection = ({ title, products, viewAllHref }: { title: string, products: Product[], viewAllHref: string }) => (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>
          {products.length > 4 && (
            <Link href={viewAllHref} className="text-[#950606] font-semibold hover:underline flex items-center gap-2">
              View All <ArrowRight size={18} />
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-xl text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {products.slice(0, 8).map((product, index) => (
                <motion.div 
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No products in this section yet.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )

  return (
    <div>
      {/* Dynamic Hero Section with Carousel */}
      {hero ? (
        <section 
          className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#950606]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop Images Carousel */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <AnimatePresence mode="wait">
              {hero.desktopImages && hero.desktopImages[currentSlide] && (
                <motion.div
                  key={`desktop-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={hero.desktopImages[currentSlide].url}
                    alt={hero.desktopImages[currentSlide].alt || hero.title}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Mobile Images Carousel */}
          <div className="absolute inset-0 z-0 md:hidden">
            <AnimatePresence mode="wait">
              {hero.mobileImages && hero.mobileImages[currentSlide] && (
                <motion.div
                  key={`mobile-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={hero.mobileImages[currentSlide].url}
                    alt={hero.mobileImages[currentSlide].alt || hero.title}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(to bottom, ${hero.overlayColor}${Math.round(hero.overlayOpacity * 100).toString(16).padStart(2, '0')} 0%, transparent 50%, ${hero.overlayColor}${Math.round(hero.overlayOpacity * 200).toString(16).padStart(2, '0')} 100%)`
            }}
          />
          
          {/* Navigation Arrows - Mobile & Desktop */}
          {maxSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all"
                aria-label="Next slide"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {maxSlides > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {activeImages?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
             <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-archivo-black text-white mb-1 tracking-wider drop-shadow-lg">
                {hero.title}
              </h1>
              
              {hero.subtitle && (
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md mt-0">
                  {hero.subtitle}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link 
                  href={hero.primaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#950606] px-8 py-3 rounded-full font-medium text-base hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
                >
                  <ShoppingBag size={20} />
                  {hero.primaryButtonText}
                </Link>
                <Link 
                  href={hero.secondaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-medium text-base hover:bg-white hover:text-[#950606] transition-all active:scale-95 shadow-xl"
                >
                  {hero.secondaryButtonText}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <div className="min-h-[80vh] bg-[#950606] flex items-center justify-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      )}

      {/* Featured Categories - Swipeable */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-[#950606] hover:text-white hover:border-[#950606] transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-[#950606] hover:text-white hover:border-[#950606] transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <Link 
                key={category._id}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/5] bg-gradient-to-br from-[#950606] to-[#6b0404] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-start"
              >
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:scale-110 transition-transform drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
                
                {index === categories.length - 1 && (
                  <div className="md:hidden absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                )}
              </Link>
            ))}
          </div>

          <p className="md:hidden text-center text-sm text-gray-500 mt-4">
            ← Swipe to explore more →
          </p>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductSection 
          title="New Arrivals" 
          products={newArrivals} 
          viewAllHref="/shop?badge=New%20Arrival"
        />
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <ProductSection 
          title="Best Sellers" 
          products={bestSellers} 
          viewAllHref="/shop?badge=Best%20Seller"
        />
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <ProductSection 
          title="On Sale" 
          products={saleProducts} 
          viewAllHref="/shop?badge=Sale"
        />
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Featured Products
            </h2>
            
            {loading ? (
              <div className="text-center py-12 text-xl text-gray-500">Loading featured products...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {featuredProducts.map((product, index) => (
                    <motion.div 
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            
            <div className="text-center mt-12">
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#950606] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7a0505] transition-colors"
              >
                View All Products
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}