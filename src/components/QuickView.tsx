'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
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
  unavailableSizes?: string[]
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

export default function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const [size, setSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoRef = useRef<number | null>(null)
  const autoIdxRef = useRef(0)

  const stockStr = (product.stock || '').toLowerCase()
  const soldOut = stockStr.includes('out') || product.stockQuantity === 0
  const lowStock = stockStr.includes('low')
  const sizes = product.sizes || []
  const unavailable = (product.unavailableSizes || []).map(String)
  const images = product.images?.length ? product.images : []

  useEffect(() => {
    if (open) {
      setSize(sizes.find((s) => !unavailable.includes(String(s))) || null)
      setAdded(false)
      autoIdxRef.current = 0
      if (scrollRef.current) scrollRef.current.scrollTop = 0
    } else {
      stopAuto()
      setAdded(false)
    }
    return () => stopAuto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const stopAuto = () => {
    if (autoRef.current) {
      clearInterval(autoRef.current)
      autoRef.current = null
    }
  }

  // Hover pe auto next image scroll
  const startAuto = () => {
    if (images.length < 2) return
    stopAuto()
    autoRef.current = window.setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      autoIdxRef.current = (autoIdxRef.current + 1) % images.length
      const child = el.children[autoIdxRef.current] as HTMLElement | undefined
      child?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 1500)
  }

  const canAdd = !soldOut && (sizes.length === 0 || !!size)

  const handleAdd = () => {
    if (!canAdd || added) return
    const color = product.colors?.[0]
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color,
      size: size || undefined,
      images: product.images || [],
    })
    // Sirf tick dikhao
    setAdded(true)
    // 0.8s baad modal band + cart auto-open
    setTimeout(() => {
      onClose()
      toggleCart()
    }, 800)
  }

  const buyNow = () => {
    if (!canAdd || added) return
    const color = product.colors?.[0]
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color,
      size: size || undefined,
      images: product.images || [],
    })
    onClose()
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[85] w-[92vw] max-w-[1000px] h-[85vh] md:h-[80vh] bg-white rounded-[20px] overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Left: stacked images - hover = auto next */}
            <div
              ref={scrollRef}
              onMouseEnter={startAuto}
              onMouseLeave={stopAuto}
              className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-white scrollbar-hide"
            >
              {images.length > 0 ? (
                images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={sanityImg(src, 1000)}
                    alt={product.name}
                    className="w-full h-auto object-contain"
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>

            {/* Right: sage panel */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#e9ece7] p-7 md:p-9 flex flex-col relative overflow-y-auto">
              <button onClick={onClose} className="absolute top-5 right-5 p-1 text-gray-800 hover:text-black transition-colors">
                <X size={22} strokeWidth={1.5} />
              </button>

              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pr-8">{product.name}</h2>
              <div className="mt-2 text-[15px] text-gray-900">Rs. {fmt(product.price)}</div>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-800">
                <span className="w-3 h-3 rounded-full border-4 border-gray-900 inline-block" />
                {soldOut ? 'Sold out' : lowStock ? 'Low stock' : 'In stock'}
              </div>

              {sizes.length > 0 && (
                <div className="mt-5">
                  <div className="text-sm text-gray-800 mb-2.5">Size</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                      const isUn = unavailable.includes(String(s))
                      return (
                        <button
                          key={s}
                          disabled={isUn || soldOut}
                          onClick={() => setSize(String(s))}
                          className={`min-w-[56px] px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-out active:scale-95 ${
                            isUn
                              ? 'bg-white/60 text-gray-400 line-through cursor-not-allowed'
                              : size === String(s)
                              ? 'bg-black text-white shadow-md'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex-1 min-h-4" />

              {/* Add to cart - black button, success pe sirf tick */}
              <button
                onClick={handleAdd}
                disabled={!canAdd || added}
                className="w-full bg-black text-white rounded-xl py-3.5 flex items-center justify-center font-medium hover:bg-gray-800 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check size={20} strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <BagPlusIcon size={18} /> Add to cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={buyNow}
                disabled={!canAdd || added}
                className="mt-2.5 w-full bg-black text-white rounded-xl py-3.5 font-medium hover:bg-gray-800 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black"
              >
                Buy it now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}