'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { client } from '@/lib/sanity'
import { categoriesQuery } from '@/lib/queries'

interface Category {
  _id: string
  name: string
  slug: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { items, toggleCart } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await client.fetch(categoriesQuery)
        const normalized = data.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug?.current || cat.slug || ''
        }))
        setCategories(normalized)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Header - Always White (Outfitbydk Style) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - Theater Font */}
            <Link href="/" className="font-theater text-3xl tracking-wider text-[#950606]">
              THRIVERS
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Shop Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-[13px] font-medium uppercase tracking-wider text-gray-900 hover:text-[#950606] transition-colors">
                  Shop <ChevronDown size={14} strokeWidth={1.5} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-none shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 border border-gray-100 max-h-[70vh] overflow-y-auto">
                  <div className="px-4 py-2 text-[11px] font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    Shop by Category
                  </div>
                  {categories.map((category) => (
                    <Link 
                      key={category._id}
                      href={`/shop?category=${encodeURIComponent(category.name)}`}
                      className="block px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#950606] uppercase tracking-wider"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/shop" className="block px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#950606] uppercase tracking-wider">All Products</Link>
                    <Link href="/shop?badge=New%20Arrival" className="block px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#950606] uppercase tracking-wider">New Arrivals</Link>
                    <Link href="/shop?badge=Best%20Seller" className="block px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#950606] uppercase tracking-wider">Best Sellers</Link>
                    <Link href="/shop?badge=Sale" className="block px-4 py-2 text-[13px] font-medium text-[#950606] hover:bg-gray-50 uppercase tracking-wider">Sale</Link>
                  </div>
                </div>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[13px] font-medium uppercase tracking-wider text-gray-900 hover:text-[#950606] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSearch}
                      className="absolute right-10 flex items-center"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-4 py-2 text-[13px] rounded-none border border-gray-300 focus:outline-none focus:border-[#950606]"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-900 hover:text-[#950606] transition-colors">
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Cart */}
              <button onClick={toggleCart} className="relative p-2 text-gray-900 hover:text-[#950606] transition-colors">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#950606] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 text-gray-900 hover:text-[#950606] transition-colors">
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Up Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600">
                <X size={20} strokeWidth={1.5} />
              </button>

              <nav className="space-y-5 mt-4">
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Shop by Category
                </div>
                {categories.map((category) => (
                  <Link 
                    key={category._id}
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setIsMenuOpen(false)} 
                    className="block text-[14px] font-medium text-gray-900 uppercase tracking-wider hover:text-[#950606]"
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 pt-4 space-y-5">
                  <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="block text-[14px] font-medium text-gray-900 uppercase tracking-wider">All Products</Link>
                  <Link href="/shop?badge=New%20Arrival" onClick={() => setIsMenuOpen(false)} className="block text-[14px] font-medium text-gray-900 uppercase tracking-wider">New Arrivals</Link>
                  <Link href="/shop?badge=Sale" onClick={() => setIsMenuOpen(false)} className="block text-[14px] font-medium text-[#950606] uppercase tracking-wider">Sale - Upto 50% OFF</Link>
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-[14px] font-medium text-gray-900 uppercase tracking-wider">Home</Link>
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-[14px] font-medium text-gray-900 uppercase tracking-wider">About</Link>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-[14px] font-medium text-gray-900 uppercase tracking-wider">Contact</Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}