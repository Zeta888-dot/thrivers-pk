'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import QuickView from './QuickView'
import { sanityImg } from '@/lib/sanity'

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
  unavailableSizes?: string[]
  category?: { name: string; slug: string }
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const BagPlusIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 8h13l-.9 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5.5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    <path d="M12 11.5v5M9.5 14h5" />
  </svg>
)

export default function ProductCard({ product }: { product: Product }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [quickOpen, setQuickOpen] = useState(false)

  const images = product.images?.length ? product.images : []
  const stockStr = (product.stock || '').toLowerCase()
  const soldOut = stockStr.includes('out') || product.stockQuantity === 0
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price

  const handleEnter = () => {
    if (images.length > 1) setImgIdx((i) => (i + 1) % images.length)
  }
  const handleLeave = () => setImgIdx(0)

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % images.length)
  }

  useEffect(() => {
    if (images.length > 1) {
      const nextIdx = (imgIdx + 1) % images.length
      const pre = new Image()
      pre.src = sanityImg(images[nextIdx], 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgIdx])

  return (
    <>
      <div className="group relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            {images[imgIdx] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={imgIdx}
                src={sanityImg(images[imgIdx], 800)}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover animate-fade transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
          </Link>

          {/* Sold out pill - northstory jaisa top right */}
          {soldOut && (
            <span className="absolute top-3 right-3 bg-[#e9ece7]/95 text-gray-800 text-xs font-medium px-3.5 py-1.5 rounded-full pointer-events-none">
              Sold out
            </span>
          )}

          {/* Hover arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
              >
                <ArrowLeft size={36} strokeWidth={1.25} />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
              >
                <ArrowRight size={36} strokeWidth={1.25} />
              </button>
            </>
          )}

          {/* Cart icon circle → Choose pill on hover */}
          <button
            onClick={() => setQuickOpen(true)}
            aria-label="Quick view"
            className="group/btn hidden md:flex absolute bottom-4 right-4 items-center bg-[#eef0ea]/95 text-gray-900 rounded-full px-3.5 py-3.5 shadow-lg hover:bg-white hover:scale-[1.03] active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <BagPlusIcon size={18} />
            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover/btn:max-w-[70px] group-hover/btn:opacity-100 group-hover/btn:ml-2">
              Choose
            </span>
          </button>
        </div>

        {/* Name + price - northstory jaisa chhota */}
        <Link href={`/product/${product.slug}`} className="block pt-2 md:pt-3 pb-0">
          <h3 className="pl-4 md:pl-6 text-[13px] md:text-[15px] font-normal text-gray-800 leading-snug">
            {product.name}
          </h3>
          <div className="pl-5 md:pl-[52px] mt-0.5 flex items-baseline gap-2">
            <span className="text-[13px] md:text-[15px] text-gray-800">Rs. {fmt(product.price)}</span>
            {onSale && (
              <span className="text-[11px] md:text-[13px] text-gray-500 line-through">
                Rs. {fmt(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </Link>
      </div>

      <QuickView product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  )
}