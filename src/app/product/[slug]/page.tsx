'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { client } from '@/lib/sanity'
import { productBySlugQuery } from '@/lib/queries'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import { PortableText } from 'next-sanity'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  const { addItem, toggleCart } = useCartStore()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await client.fetch(productBySlugQuery, { slug })
        if (data) {
          setProduct(data)
          if (data.colors?.length) setSelectedColor(data.colors[0])
          if (data.sizes?.length) setSelectedSize(data.sizes[0])
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      images: product.images || [],
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    toggleCart()
  }

  if (loading) return <div className="py-20 text-center text-xl">Loading product...</div>
  if (!product) return <div className="py-20 text-center text-xl">Product not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images Section with Swipe */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            <>
              {/* Main Image with Swipe */}
              <div 
                className="aspect-[3/4] md:aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative"
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                onTouchEnd={() => {
                  if (!touchStart || !touchEnd) return
                  const distance = touchStart - touchEnd
                  const isLeftSwipe = distance > 50
                  const isRightSwipe = distance < -50
                  if (isLeftSwipe && selectedImage < product.images.length - 1) {
                    setSelectedImage(selectedImage + 1)
                  }
                  if (isRightSwipe && selectedImage > 0) {
                    setSelectedImage(selectedImage - 1)
                  }
                  setTouchStart(0)
                  setTouchEnd(0)
                }}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => selectedImage > 0 && setSelectedImage(selectedImage - 1)}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-opacity ${selectedImage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                      <ChevronLeft size={20} className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => selectedImage < product.images.length - 1 && setSelectedImage(selectedImage + 1)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-opacity ${selectedImage === product.images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                      <ChevronRight size={20} className="text-gray-800" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {selectedImage + 1}/{product.images.length}
                    </div>
                    
                    {/* Dots Indicator - Overlay on Image */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
                      {product.images.map((_: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            selectedImage === idx
                              ? 'w-8 h-2 bg-white'
                              : 'w-2 h-2 bg-white/60 hover:bg-white/90'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="aspect-[3/4] md:aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-700 mb-2">PKR {product.price.toLocaleString()}</p>
          
          {/* Stock Status */}
          {product.stock === 'in_stock' && (
            <p className="text-green-600 text-sm mb-6">✓ In Stock</p>
          )}
          
          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size ? 'bg-[#950606] text-white border-[#950606]' : 'border-gray-300 text-gray-700 hover:border-[#950606]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      selectedColor === color ? 'border-[#950606] scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100">
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100">
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 'out_of_stock' || product.stock === 'sold_out'}
              className="flex-1 flex items-center justify-center gap-2 bg-[#950606] text-white py-3 rounded-lg font-semibold hover:bg-[#7a0505] transition-colors disabled:bg-gray-400"
            >
              {isAdded ? <><Check size={20} /> Added!</> : <><ShoppingBag size={20} /> Add to Cart</>}
            </button>
          </div>

          {/* Product Description - At the Bottom */}
          {product.description && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Product Description
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <PortableText 
                  value={product.description}
                  components={{
                    block: {
                      h2: ({children}) => <h2 className="text-lg font-bold text-gray-900 mt-4 mb-2">{children}</h2>,
                      h3: ({children}) => <h3 className="text-base font-semibold text-gray-900 mt-3 mb-1">{children}</h3>,
                      normal: ({children}) => <p className="mb-2">{children}</p>,
                    },
                    list: {
                      bullet: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      number: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      underline: ({children}) => <span className="underline">{children}</span>,
                    },
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}