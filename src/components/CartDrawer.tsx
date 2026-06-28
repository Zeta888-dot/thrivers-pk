'use client'

import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore()
  const [currentImages, setCurrentImages] = useState<{[key: string]: number}>({})

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleNextImage = (itemId: string, totalImages: number) => {
    setCurrentImages(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }))
  }

  const handlePrevImage = (itemId: string, totalImages: number) => {
    setCurrentImages(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#950606]/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">Your cart is empty</div>
              ) : (
                items.map((item) => {
                  const productImages = item.images || []
                  const currentIndex = currentImages[item.id] || 0
                  const hasMultipleImages = productImages.length > 1

                  return (
                    <div key={item.id} className="flex gap-4">
                      {/* Image with Carousel */}
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePrevImage(item.id, productImages.length)
                                  }}
                                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-[#950606]/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                >
                                  <ChevronLeft size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleNextImage(item.id, productImages.length)
                                  }}
                                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-[#950606]/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                >
                                  <ChevronRight size={12} />
                                </button>
                                {/* Image Counter */}
                                <div className="absolute bottom-1 right-1 bg-[#950606]/70 text-white text-xs px-1.5 py-0.5 rounded">
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

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.color && <span>Color: {item.color} </span>}
                          {item.size && <span>| Size: {item.size}</span>}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded">
                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 px-2">
                              <Minus size={14} />
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 px-2">
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-semibold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <Link 
                  href="/checkout" 
                  onClick={toggleCart}
                  className="block w-full bg-[#950606] text-white py-3 rounded-lg font-semibold hover:bg-[#7a0505] transition-colors text-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
