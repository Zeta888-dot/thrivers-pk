'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Search, User, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { client, sanityImg } from '@/lib/sanity'
import { productsQuery, categoriesQuery } from '@/lib/queries'

const BANNER_TEXT = '10% OFF On Prepaid Orders | New Drop Live Now'

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const BagIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 8h13l-.9 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5.5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
)

/* 2-line hamburger */
const MenuIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
)

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  images?: string[]
  colors?: string[]
  sizes?: string[]
  stock?: string
  stockQuantity?: number
  unavailableSizes?: string[]
}

interface Category {
  _id: string
  name: string
  slug: string
}

/* Search card - same size, hover pe next image */
function SearchCard({ p, onClose }: { p: Product; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  const images = p.images?.length ? p.images : []
  return (
    <div
      className="group relative"
      onMouseEnter={() => images.length > 1 && setImgIdx((i) => (i + 1) % images.length)}
      onMouseLeave={() => setImgIdx(0)}
    >
      <Link href={`/product/${p.slug}`} onClick={onClose} className="block">
        <div className="h-[180px] md:h-[280px] flex items-center justify-center overflow-hidden">
          {images[imgIdx] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={imgIdx}
              src={sanityImg(images[imgIdx], 600)}
              alt={p.name}
              className="max-h-full w-auto object-contain animate-fade"
            />
          )}
        </div>
        <div className="mt-3 text-[15px] text-gray-900">{p.name}</div>
        <div className="text-[15px] text-gray-800">Rs. {fmt(p.price)}</div>
      </Link>
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [searchProducts, setSearchProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recent, setRecent] = useState<Product[]>([])
  const pathname = usePathname()
  const { items, toggleCart } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const isHome = pathname === '/'
  const filled = isScrolled || isHover || !isHome

  // Scroll down = slide up disappear; scroll up = wapas
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > 40)
      setHidden(y > lastY && y > 240)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    client
      .fetch(productsQuery)
      .then((data) =>
        setSearchProducts(
          data.map((p: any) => ({ ...p, slug: p.slug?.current || p.slug }))
        )
      )
      .catch(() => {})
    client
      .fetch(categoriesQuery)
      .then((data) =>
        setCategories(
          data.map((c: any) => ({
            _id: c._id,
            name: c.name,
            slug: c.slug?.current || c.slug || '',
          }))
        )
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isSearchOpen) {
      try {
        const raw = localStorage.getItem('thrivers_recent')
        if (raw) setRecent(JSON.parse(raw))
      } catch {}
    }
  }, [isSearchOpen])

  const handleClear = () => {
    setSearchQuery('')
    setRecent([])
    try {
      localStorage.removeItem('thrivers_recent')
    } catch {}
  }

  const filtered = searchQuery.trim()
    ? searchProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchProducts

  const linkColor = filled
    ? 'text-gray-700 hover:text-black'
    : 'text-white drop-shadow-md hover:text-gray-200'
  const iconColor = filled ? 'text-black' : 'text-white drop-shadow-md'

  return (
    <>
      <div
        className={`sticky top-0 left-0 right-0 z-[80] transition-transform duration-300 ${
          hidden ? '-translate-y-[101%]' : 'translate-y-0'
        }`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* Marquee */}
        <div className="bg-[#2e3b12] text-white overflow-hidden py-2.5">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-xs font-bold tracking-wider px-4">
                    {BANNER_TEXT} <span className="px-6">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main header */}
        <header
          className={`transition-colors duration-300 ${
            filled
              ? 'bg-[#f7f6f2] shadow-sm'
              : 'bg-gradient-to-b from-black/40 via-black/15 to-transparent'
          }`}
        >
          <div className="px-2 md:px-6 xl:px-10 py-4 md:py-5 grid grid-cols-3 items-center">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className={`md:hidden p-1 ${iconColor}`}>
                <MenuIcon />
              </button>
              <button onClick={() => setIsSearchOpen(true)} className={`md:hidden p-1 ${iconColor}`}>
                <Search size={22} strokeWidth={1.5} />
              </button>
              {/* Desktop nav - Shop dropdown */}
              <nav className="hidden md:flex items-center gap-7">
                <Link href="/" className={`text-[15px] font-semibold transition-colors ${linkColor}`}>
                  Home
                </Link>
                <div
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <button className={`flex items-center gap-1.5 text-[15px] font-semibold transition-colors ${linkColor}`}>
                    Shop
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {shopOpen && (
                    <div className="absolute left-0 top-full pt-3 z-40">
                      <div className="bg-[#f7f6f2] shadow-xl rounded-b-xl py-4 px-6 min-w-[220px] grid gap-2.5">
                        {categories.map((c) => (
                          <Link
                            key={c._id}
                            href={`/shop?category=${encodeURIComponent(c.name)}`}
                            className="text-[15px] text-gray-700 hover:text-black transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <Link
                          href="/shop"
                          className="text-[13px] font-semibold text-gray-900 underline underline-offset-4 hover:text-black transition-colors"
                        >
                          See all →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link href="/contact" className={`text-[15px] font-semibold transition-colors ${linkColor}`}>
                  Contact
                </Link>
                <Link href="/about" className={`text-[15px] font-semibold transition-colors ${linkColor}`}>
                  Brand Story
                </Link>
              </nav>
            </div>

            {/* Center logo */}
            <div className="flex justify-center">
              <Link
                href="/"
                className={`font-archivo-black text-xl md:text-2xl tracking-tight leading-none ${
                  filled ? 'text-black' : 'text-white drop-shadow-md'
                }`}
                aria-label="Thrivers home"
              >
                THRIVERS<sup className="text-[10px] ml-0.5">™</sup>
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center justify-end gap-4 md:gap-5">
              <button onClick={() => setIsSearchOpen(true)} className={`hidden md:block p-1 ${iconColor}`}>
                <Search size={22} strokeWidth={1.5} />
              </button>
              <button className={`p-1 ${iconColor}`}>
                <User size={22} strokeWidth={1.5} />
              </button>
              <button onClick={toggleCart} className={`relative p-1 ${iconColor}`}>
                <BagIcon size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[85]"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 -translate-x-1/2 top-[10vh] md:top-[16vh] z-[90] w-[92vw] md:w-[52vw] max-w-[1340px] bg-[#e9ece7] rounded-[20px] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 md:px-8 py-5">
                <Search size={20} strokeWidth={1.5} className="text-gray-700" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent text-lg text-gray-900 placeholder-gray-600 focus:outline-none"
                />
                {(searchQuery || recent.length > 0) && (
                  <button
                    onClick={handleClear}
                    className="text-[14px] text-gray-700 underline underline-offset-4 hover:text-black transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-800 p-1">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <div className="border-t border-gray-400/40" />

              <div className="px-6 md:px-8 pt-5 pb-8 max-h-[65vh] overflow-y-auto scrollbar-hide">
                {/* Recently viewed - same card size as products */}
                {recent.length > 0 && (
                  <div className="mb-6">
                    <div className="text-[15px] font-semibold text-gray-900 mb-3">Recently viewed</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                      {recent.slice(0, 4).map((p) => (
                        <SearchCard
                          key={p._id}
                          p={p}
                          onClose={() => setIsSearchOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[15px] font-semibold text-gray-900 mb-3">Products</div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                  {filtered.slice(0, 4).map((p) => (
                    <SearchCard
                      key={p._id}
                      p={p}
                      onClose={() => setIsSearchOpen(false)}
                    />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="text-sm text-gray-500 pb-2">
                    {searchQuery ? 'No products found.' : ''}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[85]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm z-[90] bg-white overflow-y-auto"
            >
              <div className="p-6">
                <button onClick={() => setIsMenuOpen(false)} className="p-1 text-black mb-8 border border-gray-400 rounded-full" aria-label="Close menu">
                  <X size={20} />
                </button>

                <nav className="space-y-6">
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl font-bold text-gray-900 hover:text-gray-500 transition-colors"
                  >
                    Home
                  </Link>

                  {/* Shop by Category dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileCatOpen(!mobileCatOpen)}
                      className="flex items-center justify-between w-full text-xl font-bold text-gray-900 hover:text-gray-500 transition-colors"
                    >
                      Shop by Category
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileCatOpen && (
                      <div className="pl-4 mt-4 space-y-3 border-l-2 border-gray-200">
                        {categories.map((c) => (
                          <Link
                            key={c._id}
                            href={`/shop?category=${encodeURIComponent(c.name)}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-[15px] text-gray-600 hover:text-black transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <Link
                          href="/shop"
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-[13px] font-semibold text-gray-900 underline underline-offset-4"
                        >
                          See all →
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl font-bold text-gray-900 hover:text-gray-500 transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl font-bold text-gray-900 hover:text-gray-500 transition-colors"
                  >
                    Brand Story
                  </Link>
                </nav>

                {/* Bottom products row - zero gap */}
                <div className="border-t border-gray-200 mt-10 pt-6">
                  <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
                    {searchProducts.slice(0, 8).map((p) => (
                      <Link
                        key={p._id}
                        href={`/product/${p.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="w-28 shrink-0"
                      >
                        <div className="aspect-square bg-[#f4f4f2] overflow-hidden">
                          {p.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={sanityImg(p.images[0], 300)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="mt-2 text-[13px] text-gray-900 truncate">{p.name}</div>
                        <div className="text-[13px] text-gray-800">Rs. {fmt(p.price)}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}