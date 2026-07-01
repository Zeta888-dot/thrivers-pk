'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { client } from '@/lib/sanity'
import { productsQuery } from '@/lib/queries'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  images?: string[]
  colors?: string[]
  stock?: string
  category?: string
  badges?: string[]
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category')
  const urlBadge = searchParams.get('badge')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'All')
  const [selectedBadge, setSelectedBadge] = useState<string>(urlBadge || '')
  const [sortBy, setSortBy] = useState('default')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    // URL change hone par state update karo
    setSelectedCategory(urlCategory || 'All')
    setSelectedBadge(urlBadge || '')
  }, [urlCategory, urlBadge])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await client.fetch(productsQuery)
        const normalized = data.map((p: any) => ({
          ...p,
          slug: p.slug.current,
          category: p.category?.name,
          badges: p.badges || []
        }))
        setProducts(normalized)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter((c): c is string => Boolean(c))))]

  // Filtering Logic
  let filteredProducts = products
  
  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory)
  }
  
  if (selectedBadge) {
    filteredProducts = filteredProducts.filter(p => p.badges && p.badges.includes(selectedBadge))
  }

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  if (loading) return <div className="py-20 text-center text-xl">Loading products...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {selectedBadge ? `${selectedBadge} Collection` : selectedCategory !== 'All' ? `${selectedCategory}` : 'Shop All'}
        </h1>
        <p className="text-gray-600">Discover our complete collection</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
        <button className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter size={20} /> Filters
        </button>
        
        <div className={`${isFilterOpen ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCategory(cat || 'All'); setSelectedBadge('') }} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat && !selectedBadge ? 'bg-[#950606] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
          {['New Arrival', 'Best Seller', 'Sale'].map(badge => (
            <button 
              key={badge} 
              onClick={() => { setSelectedBadge(badge); setSelectedCategory('All') }} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedBadge === badge ? 'bg-[#950606] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {badge}
            </button>
          ))}
        </div>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
          <option value="default">Sort by: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      {(selectedCategory !== 'All' || selectedBadge) && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600">Active Filter:</span>
          <button onClick={() => { setSelectedCategory('All'); setSelectedBadge('') }} className="flex items-center gap-1 px-3 py-1 bg-[#950606] text-white text-sm rounded-full">
            {selectedBadge || selectedCategory} <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {sortedProducts.map((product, index) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {sortedProducts.length === 0 && <div className="text-center py-16 text-gray-500 text-lg">No products found</div>}
      <div className="mt-8 text-center text-sm text-gray-600">Showing {sortedProducts.length} products</div>
    </div>
  )
}