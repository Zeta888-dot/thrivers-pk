'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { client } from '@/lib/sanity'
import { productBySlugQuery } from '@/lib/queries'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'

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
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    toggleCart()
  }

  if (loading) return <div className="py-20 text-center text-xl">Loading product...</div>
  if (!product) return <div className="py-20 text-center text-xl">Product not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images Section */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === idx ? 'border-black' : 'border-gray-200'
                      }`}
                    >
                      <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-700 mb-6">PKR {product.price.toLocaleString()}</p>
          <p className="text-gray-600 mb-8">{product.description}</p>

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
                      selectedColor === color ? 'border-black scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
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
              disabled={!product.stock}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {isAdded ? <><Check size={20} /> Added!</> : <><ShoppingBag size={20} /> Add to Cart</>}
            </button>
          </div>

          {!product.stock && <p className="text-red-500 mt-4 text-sm">Out of stock</p>}
        </motion.div>
      </div>
    </div>
  )
}