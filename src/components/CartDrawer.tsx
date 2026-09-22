'use client'

import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* Trash bin - sirf LID rotate hoti hai hover pe, body static */
const TrashIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="trash-icon"
  >
    {/* Lid = handle + top bar (ye rotate hogi) */}
    <g className="trash-lid">
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 6h18" />
    </g>
    {/* Body = static */}
    <path d="M19 8v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore()
  const [currentImages, setCurrentImages] = useState<{ [key: string]: number }>({})

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryCharge = 300
  const grandTotal = subtotal + deliveryCharge

  const handleNextImage = (itemId: string, totalImages: number) => {
    setCurrentImages(prev => ({ ...prev, [itemId]: ((prev[itemId] || 0) + 1) % totalImages }))
  }
  const handlePrevImage = (itemId: string, totalImages: number) => {
    setCurrentImages(prev => ({ ...prev, [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
           className="fixed inset-0 bg-black/40 z-[95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Drawer - northstory sage style */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-[#e9ece7] z-[100] shadow-xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-end p-5">
              <button onClick={toggleCart} className="p-1 text-gray-800 hover:text-black transition-colors">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24 text-center">
                <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">Your cart is empty</h2>
                <p className="mt-3 text-[15px] text-gray-700">
                  Have an account?{' '}
                  <Link href="/contact" className="underline underline-offset-4 hover:text-black">Log in</Link>{' '}
                  to check out faster.
                </p>
                <button
                  onClick={toggleCart}
                  className="mt-8 bg-black text-white px-10 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 space-y-6">
                  {items.map((item) => {
                    const productImages = item.images || []
                    const currentIndex = currentImages[item.id] || 0
                    const hasMultipleImages = productImages.length > 1
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-24 h-24 bg-white/70 flex-shrink-0 overflow-hidden">
                          {productImages.length > 0 ? (
                            <>
                              <Image
                                src={productImages[currentIndex]}
                                alt={item.name}
                                fill
                                className="object-cover cursor-pointer"
                                onClick={() => hasMultipleImages && handleNextImage(item.id, productImages.length)}
                              />
                              {hasMultipleImages && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handlePrevImage(item.id, productImages.length) }}
                                    className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-black/60 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <ChevronLeft size={12} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleNextImage(item.id, productImages.length) }}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black/60 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <ChevronRight size={12} />
                                  </button>
                                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                    {currentIndex + 1}/{productImages.length}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span> | Size: {item.size}</span>}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-400/60 rounded-lg bg-white/50">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1.5 px-3 hover:bg-black/5 transition-colors text-gray-800"
                              >
                                −
                              </button>
                              <span className="px-3 text-sm font-medium text-gray-900 min-w-[28px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 px-3 hover:bg-black/5 transition-colors text-gray-800"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-semibold text-gray-900">Rs. {fmt(item.price * item.quantity)}</p>
                          </div>
                        </div>

                        {/* Trash - hover pe lid khulti hai */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-600 hover:text-black transition-colors self-start p-1"
                          aria-label="Remove item"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-gray-400/40 p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Subtotal</span>
                      <span>Rs. {fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Delivery</span>
                      <span>Rs. {fmt(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-400/40">
                      <span>Total</span>
                      <span>Rs. {fmt(grandTotal)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="block w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={toggleCart}
                    className="block w-full bg-transparent text-gray-900 border border-gray-500 py-3.5 rounded-lg font-medium hover:bg-black/5 transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}