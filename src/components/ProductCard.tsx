'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
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
  const hasMultipleImages = product.images && product.images.length > 1

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length)
    }
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <motion.div
        className="group relative"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Product Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
          {product.images && product.images.length > 0 ? (
            <>
              {/* Main Image */}
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300"
              />

              {/* Navigation Arrows - Show on hover or when multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} className="text-gray-800" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setCurrentImageIndex(index)
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-[#950606] w-4'
                            : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Hover Overlay with Buttons */}
              <motion.div
                className="absolute inset-0 bg-[#950606]/20 backdrop-blur-[2px] flex items-center justify-center gap-3 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-4 py-2.5 bg-white text-[#950606] text-sm font-bold rounded-full hover:bg-[#950606] hover:text-white transition-colors text-center shadow-lg"
                >
                  View
                </Link>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-4 py-2.5 bg-white text-[#950606] text-sm font-bold rounded-full hover:bg-[#950606] hover:text-white transition-colors text-center shadow-lg"
                >
                  Choose options
                </Link>
              </motion.div>

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
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No Image</span>
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

          {/* Stock Status */}
          {product.stock === 'out_of_stock' || product.stock === 'sold_out' ? (
            <p className="text-xs text-red-500 font-medium mt-1">Sold Out</p>
          ) : product.stock === 'low_stock' ? (
            <p className="text-xs text-orange-500 font-medium mt-1">Low Stock</p>
          ) : null}

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