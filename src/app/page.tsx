'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden vignette">
        <div className="absolute inset-0 bg-gradient-to-br from-[#950606]/90 via-[#6b0404]/80 to-[#4a0202]/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
              Thrivers
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-[#950606] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
              >
                <ShoppingBag size={20} />
                Shop Now
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 bg-white/10 text-white border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm"
              >
                Learn More
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['T-Shirts', 'Hoodies', 'Accessories'].map((category, index) => (
              <Link 
                key={category}
                href={`/shop?category=${category.toLowerCase()}`}
                className="group relative aspect-square bg-gradient-to-br from-[#950606] to-[#6b0404] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:scale-110 transition-transform">
                    {category}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Placeholder for featured products */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-[3/4] bg-gray-100 rounded-lg" />
            ))}
          </div>
          
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
    </div>
  )
}