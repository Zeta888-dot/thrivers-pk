'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { client } from '@/lib/sanity'
import { categoriesQuery, productsQuery, productsByBadgeQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'

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
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsData, productsData, newArrivalsData, bestSellersData, saleData] = await Promise.all([
          client.fetch(categoriesQuery),
          client.fetch(productsQuery),
          client.fetch(productsByBadgeQuery, { badge: 'New Arrival' }),
          client.fetch(productsByBadgeQuery, { badge: 'Best Seller' }),
          client.fetch(productsByBadgeQuery, { badge: 'Sale' }),
        ])
        
        setCategories(catsData)
        
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
      {/* Hero Section */}
      <section className="hero-gradient min-h-[45vh] md:min-h-[80vh] flex items-center justify-center relative overflow-hidden vignette py-12 md:py-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#950606]/90 via-[#6b0404]/80 to-[#4a0202]/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 tracking-wider">
              THRIVERS
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
              <Link 
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#950606] px-5 py-2.5 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all active:scale-95"
              >
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border-2 border-white px-5 py-2.5 rounded-full font-semibold text-sm sm:text-base hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm"
              >
                Learn More
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

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
                href={`/shop?category=${category.slug}`}
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