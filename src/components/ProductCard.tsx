'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/product/${product.slug}`}>
      <motion.div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Hover Overlay with Buttons */}
          <motion.div
            className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-black hover:text-white transition-colors">
              View
            </button>
            <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-black hover:text-white transition-colors">
              Choose options
            </button>
          </motion.div>

          {/* Stock Badge */}
          {product.stock === 'out_of_stock' || product.stock === 'sold_out' ? (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Sold Out
            </div>
          ) : product.stock === 'low_stock' ? (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </div>
          ) : null}

          {/* Discount Badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price with Discount */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="font-semibold text-lg">
              PKR {product.price.toLocaleString()}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <p className="text-sm text-gray-400 line-through">
                  PKR {product.compareAtPrice.toLocaleString()}
                </p>
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
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
            <div className="flex gap-1 mt-2">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}