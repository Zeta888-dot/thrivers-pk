'use client'

import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, Check, SlidersHorizontal, LayoutGrid, Square } from 'lucide-react'
import { motion } from 'framer-motion'
import { client } from '@/lib/sanity'
import { productsQuery, categoriesQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'

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
  featured?: boolean
  badges?: string[]
  unavailableSizes?: string[]
  category?: { name: string; slug: string }
}

interface Category {
  _id: string
  name: string
  slug: string
  image?: string
}

function Dropdown({
  label,
  value,
  options,
  onSelect,
  align = 'left',
}: {
  label: string
  value: string
  options: { v: string; l: string }[]
  onSelect: (v: string) => void
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = options.find((o) => o.v === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[15px] text-gray-800 py-2 hover:text-black transition-colors"
      >
        {current && value !== '' ? current.l : label}
        <ChevronDown size={16} strokeWidth={1.5} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-2 w-60 bg-[#e9ece7] rounded-xl shadow-xl py-2 z-30 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((o) => (
            <button
              key={o.v}
              onClick={() => {
                onSelect(o.v)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2.5 text-[15px] text-gray-800 hover:bg-black/5 transition-colors flex items-center"
            >
              <span className="w-5 shrink-0">
                {o.v === value && <Check size={14} strokeWidth={2} />}
              </span>
              {o.l}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ShopContent() {
  const params = useSearchParams()
  const categoryParam = params.get('category')
  const badgeParam = params.get('badge')
  const search = params.get('search')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [category, setCategory] = useState(categoryParam || '')
  const [badge, setBadge] = useState(badgeParam || '')
  const [availability, setAvailability] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sort, setSort] = useState('featured')
  const [cols, setCols] = useState<1 | 2>(2)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setCategory(categoryParam || '')
    setBadge(badgeParam || '')
  }, [categoryParam, badgeParam])

  useEffect(() => {
    async function fetchAll() {
      try {
        const [pData, cData] = await Promise.all([
          client.fetch(productsQuery),
          client.fetch(categoriesQuery),
        ])
        setProducts(
          pData.map((p: any) => ({
            ...p,
            slug: p.slug?.current || p.slug,
            category: p.category
              ? {
                  name: p.category.name,
                  slug: p.category.slug?.current || p.category.slug,
                }
              : undefined,
          }))
        )
        setCategories(
          cData.map((c: any) => ({
            _id: c._id,
            name: c.name,
            slug: c.slug?.current || c.slug || '',
            image: c.image,
          }))
        )
      } catch (e) {
        console.error('Failed to fetch shop data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (category && p.category?.name !== category) return false
      if (badge && !(p.badges || []).includes(badge)) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (availability === 'in' && (p.stock || '').includes('out')) return false
      if (availability === 'out' && !(p.stock || '').includes('out')) return false
      if (priceRange === 'under25' && p.price >= 2500) return false
      if (priceRange === '25to40' && (p.price < 2500 || p.price > 4000)) return false
      if (priceRange === 'over40' && p.price <= 4000) return false
      return true
    })
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'az':
        return [...list].sort((a, b) => a.name.localeCompare(b.name))
      case 'za':
        return [...list].sort((a, b) => b.name.localeCompare(a.name))
      case 'best':
        return [...list].sort((a, b) => {
          const ab = (a.badges || []).includes('Best Seller') ? 0 : 1
          const bb = (b.badges || []).includes('Best Seller') ? 0 : 1
          return ab - bb
        })
      default:
        return list
    }
  }, [products, category, badge, search, availability, priceRange, sort])

  const title = search
    ? `Search: "${search}"`
    : badge
    ? badge
    : category
    ? category
    : 'Products'

  const sortOptions = [
    { v: 'featured', l: 'Featured' },
    { v: 'best', l: 'Best selling' },
    { v: 'az', l: 'Alphabetically, A-Z' },
    { v: 'za', l: 'Alphabetically, Z-A' },
    { v: 'price-asc', l: 'Price, low to high' },
    { v: 'price-desc', l: 'Price, high to low' },
  ]

  const gridCols =
    cols === 1
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div className="pt-4 md:pt-8 min-h-screen bg-[#f7f7f5]">
      <div className="px-3 md:px-6 pb-6 md:pb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-[13px] md:text-[15px] font-semibold text-gray-900">
          Limited Pieces Only
        </p>

        {/* Toolbar - northstory mobile jaisa */}
        <div className="mt-6 md:mt-10 flex items-center justify-between">
          {/* Left: mobile Filter button / desktop dropdowns */}
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden flex items-center gap-2 text-[15px] text-gray-800"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Filter
            </button>
            <div className="hidden md:flex items-center gap-6 md:gap-8">
              <Dropdown
                label="Category"
                value={category}
                onSelect={setCategory}
                options={[
                  { v: '', l: 'All categories' },
                  ...categories.map((c) => ({ v: c.name, l: c.name })),
                ]}
              />
              <Dropdown
                label="Availability"
                value={availability}
                onSelect={setAvailability}
                options={[
                  { v: '', l: 'All' },
                  { v: 'in', l: 'In stock' },
                  { v: 'out', l: 'Sold out' },
                ]}
              />
              <Dropdown
                label="Price"
                value={priceRange}
                onSelect={setPriceRange}
                options={[
                  { v: '', l: 'All prices' },
                  { v: 'under25', l: 'Under Rs. 2,500' },
                  { v: '25to40', l: 'Rs. 2,500 - Rs. 4,000' },
                  { v: 'over40', l: 'Over Rs. 4,000' },
                ]}
              />
            </div>
          </div>

          {/* Right: count + sort (desktop) + view toggle */}
          <div className="flex items-center gap-4 md:gap-6">
            <span className="hidden md:inline text-[15px] text-gray-700">
              {loading ? '…' : `${filtered.length} items`}
            </span>
            <div className="hidden md:block">
              <Dropdown label="Sort" value={sort} onSelect={setSort} options={sortOptions} align="right" />
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCols(1)}
                aria-label="Single column view"
                className={`p-2 rounded-md transition-colors ${cols === 1 ? 'bg-gray-200 text-black' : 'text-gray-500 hover:text-black'}`}
              >
                <Square size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setCols(2)}
                aria-label="Grid view"
                className={`p-2 rounded-md transition-colors ${cols === 2 ? 'bg-gray-200 text-black' : 'text-gray-500 hover:text-black'}`}
              >
                <LayoutGrid size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filter panel */}
        {filtersOpen && (
          <div className="md:hidden mt-4 bg-[#e9ece7] rounded-xl p-4 space-y-1">
            <Dropdown
              label="Category"
              value={category}
              onSelect={setCategory}
              options={[
                { v: '', l: 'All categories' },
                ...categories.map((c) => ({ v: c.name, l: c.name })),
              ]}
            />
            <Dropdown
              label="Availability"
              value={availability}
              onSelect={setAvailability}
              options={[
                { v: '', l: 'All' },
                { v: 'in', l: 'In stock' },
                { v: 'out', l: 'Sold out' },
              ]}
            />
            <Dropdown
              label="Price"
              value={priceRange}
              onSelect={setPriceRange}
              options={[
                { v: '', l: 'All prices' },
                { v: 'under25', l: 'Under Rs. 2,500' },
                { v: '25to40', l: 'Rs. 2,500 - Rs. 4,000' },
                { v: 'over40', l: 'Over Rs. 4,000' },
              ]}
            />
            <Dropdown label="Sort" value={sort} onSelect={setSort} options={sortOptions} />
          </div>
        )}
      </div>

      {/* Zero-gap grid with layout animation */}
      {loading ? (
        <div className={`grid ${gridCols} gap-0`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-200/70 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className={`grid ${gridCols} gap-0 pb-10 md:pb-16`}>
          {filtered.map((product) => (
            <motion.div
              key={product._id}
              layout
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500">
          No products found{search ? ` for "${search}"` : ''}.
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-4 min-h-screen bg-[#f7f7f5]" />}>
      <ShopContent />
    </Suspense>
  )
}