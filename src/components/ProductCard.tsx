'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: string[]
  colors?: string[]
  stock?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const hasMultipleImages = product.images && product.images.length > 1

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length)
    }
  }

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length)
    }
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      nextImage()
    }
    if (isRightSwipe) {
      prevImage()
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  if (!product.images || product.images.length === 0) {
    return (
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[1/1] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="font-semibold text-lg text-[#950606] mt-1">
          PKR {product.price.toLocaleString()}
        </p>
      </Link>
    )
  }

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <motion.div
        className="group relative"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Product Image Container */}
        <div 
          ref={carouselRef}
          className="relative aspect-[1/1] overflow-hidden bg-gray-100 rounded-lg mb-3 cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Desktop Only, Transparent */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hidden md:block"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hidden md:block"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="text-white" />
              </button>

              {/* Dots Indicator - Clean & Minimal */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'bg-white w-4'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Stock Badge */}
          {product.stock === 'out_of_stock' || product.stock === 'sold_out' ? (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
              Sold Out
            </div>
          ) : product.stock === 'low_stock' ? (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
              Low Stock
            </div>
          ) : null}

          {/* Discount Badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-2 right-2 bg-[#950606] text-white text-xs px-2.5 py-1 rounded-full font-bold">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-[#950606] transition-colors">
            {product.name}
          </h3>
          
          {/* Price with Discount */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="font-semibold text-lg text-[#950606]">
              PKR {product.price.toLocaleString()}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <p className="text-sm text-gray-400 line-through">
                  PKR {product.compareAtPrice.toLocaleString()}
                </p>
                <span className="text-xs bg-[#950606] text-white px-2 py-0.5 rounded-full font-bold">
                  -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 self-center">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}