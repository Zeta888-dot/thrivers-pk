'use client'

import ProductCard from './ProductCard'
import { motion } from 'framer-motion'

// Hardcoded products for now - baad mein Sanity se ayenge
const featuredProducts = [
  {
    _id: '1',
    name: 'Classic Black T-Shirt',
    slug: 'classic-black-tshirt',
    price: 1999,
    images: [],
    colors: ['#000000', '#FFFFFF', '#808080'],
    stock: true,
  },
  {
    _id: '2',
    name: 'Urban Denim Jeans',
    slug: 'urban-denim-jeans',
    price: 3499,
    images: [],
    colors: ['#1e3a5f', '#2c5f7f'],
    stock: true,
  },
  {
    _id: '3',
    name: 'Casual White Polo',
    slug: 'casual-white-polo',
    price: 2499,
    images: [],
    colors: ['#FFFFFF', '#F5F5DC', '#000000'],
    stock: true,
  },
  {
    _id: '4',
    name: 'Streetwear Hoodie',
    slug: 'streetwear-hoodie',
    price: 4999,
    images: [],
    colors: ['#000000', '#8B4513', '#808080'],
    stock: false,
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          New Arrivals
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Check out our latest collection of premium streetwear
        </p>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <motion.a
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Products
        </motion.a>
      </div>
    </section>
  )
}