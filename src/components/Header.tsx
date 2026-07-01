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
  slug: { current: string }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { items, toggleCart } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await client.fetch(categoriesQuery)
        setCategories(data)
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

  // Color classes based on scroll state
  const textColor = isScrolled ? 'text-[#950606]' : 'text-white'
  const hoverBg = isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className={`text-2xl font-black tracking-wider transition-colors ${textColor}`}>
              THRIVERS
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Shop Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 text-sm font-semibold transition-colors ${textColor}`}>
                  Shop <ChevronDown size={16} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 border border-gray-100 max-h-[70vh] overflow-y-auto">
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    Shop by Category
                  </div>
                  {categories.map((category) => (
                    <Link 
                      key={category._id}
                      href={`/shop?category=${category.slug.current}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#950606]"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/shop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#950606]">All Products</Link>
                    <Link href="/shop?badge=New%20Arrival" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#950606]">New Arrivals</Link>
                    <Link href="/shop?badge=Best%20Seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#950606]">Best Sellers</Link>
                    <Link href="/shop?badge=Sale" className="block px-4 py-2 text-sm text-[#950606] font-semibold hover:bg-gray-50">Sale</Link>
                  </div>
                </div>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-gray-800 hover:text-[#950606]' : 'text-white hover:text-gray-200'}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1">
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
                        className={`w-full px-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#950606]/20 ${isScrolled ? 'bg-white border border-gray-200' : 'bg-white/90 backdrop-blur-sm border border-white/30'}`}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2 rounded-full transition-colors ${textColor} ${hoverBg}`}>
                  <Search size={22} />
                </button>
              </div>

              {/* Cart */}
              <button onClick={toggleCart} className={`relative p-2 rounded-full transition-colors ${textColor} ${hoverBg}`}>
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#950606] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button onClick={() => setIsMenuOpen(true)} className={`md:hidden p-2 rounded-full transition-colors ${textColor} ${hoverBg}`}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Up Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Slide Up Panel */}
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
                <X size={24} />
              </button>

              <nav className="space-y-5 mt-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Shop by Category
                </div>
                {categories.map((category) => (
                  <Link 
                    key={category._id}
                    href={`/shop?category=${category.slug.current}`}
                    onClick={() => setIsMenuOpen(false)} 
                    className="block text-base font-medium text-gray-700 hover:text-[#950606]"
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 pt-4 space-y-5">
                  <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">All Products</Link>
                  <Link href="/shop?badge=New%20Arrival" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">New Arrivals</Link>
                  <Link href="/shop?badge=Sale" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-[#950606] font-bold">Sale - Upto 50% OFF</Link>
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">Home</Link>
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">About</Link>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">Contact</Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}