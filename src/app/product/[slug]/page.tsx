'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { client, sanityImg } from '@/lib/sanity'
import { productBySlugQuery, productsQuery } from '@/lib/queries'
import { useCartStore } from '@/store/cartStore'
import { PortableText } from 'next-sanity'
import ProductCard from '@/components/ProductCard'

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const BagPlusIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 8h13l-.9 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5.5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    <path d="M12 11.5v5M9.5 14h5" />
  </svg>
)

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[12px] font-semibold tracking-widest uppercase text-gray-900">
          {title}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-gray-800 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-5 text-sm text-gray-700 leading-relaxed">{children}</div>}
    </div>
  )
}

interface RelatedProduct {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: string[]
  stock?: string
  stockQuantity?: number
  category?: { name: string; slug: string }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug
  const [product, setProduct] = useState<any>(null)
  const [related, setRelated] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const { addItem, toggleCart } = useCartStore()
  const isSoldOut = product?.stock === 'out_of_stock' || product?.stock === 'sold_out'
  const isLowStock = product?.stock === 'low_stock'
  const unavailableSizes: string[] = product?.unavailableSizes || []

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await client.fetch(productBySlugQuery, { slug })
        if (data) {
          setProduct(data)
          if (data.colors?.length) setSelectedColor(data.colors[0])
          if (data.sizes?.length) {
            const un = (data.unavailableSizes || []).map(String)
            const firstAvailable = data.sizes.find((s: string) => !un.includes(String(s)))
            setSelectedSize(firstAvailable || data.sizes[0])
          }

          // Recently viewed save (search modal ke liye)
          try {
            const entry = {
              _id: data._id,
              name: data.name,
              slug: data.slug?.current || data.slug,
              price: data.price,
              images: data.images || [],
            }
            const raw = localStorage.getItem('thrivers_recent')
            const list: any[] = raw ? JSON.parse(raw) : []
            const filteredList = list.filter((p) => p._id !== entry._id)
            localStorage.setItem(
              'thrivers_recent',
              JSON.stringify([entry, ...filteredList].slice(0, 8))
            )
          } catch {}
        }

        // Related products
        const all = await client.fetch(productsQuery)
        const normalized: RelatedProduct[] = all.map((p: any) => ({
          ...p,
          slug: p.slug?.current || p.slug,
          category: p.category
            ? { name: p.category.name, slug: p.category.slug?.current || p.category.slug }
            : undefined,
        }))
        const sameCat = normalized.filter(
          (p) => p._id !== data?._id && p.category?.name === data?.category?.name
        )
        const others = normalized.filter((p) => p._id !== data?._id)
        setRelated((sameCat.length >= 4 ? sameCat : [...sameCat, ...others]).slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleAddToCart = () => {
    if (!product || isSoldOut) return
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      images: product.images || [],
    })
    toggleCart()
  }

  const buyNow = () => {
    if (!product || isSoldOut) return
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      images: product.images || [],
    })
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="pt-2 md:pt-4 min-h-screen bg-[#f7f7f5]">
        <div className="px-4 md:px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
          <div className="grid grid-cols-2 gap-0">
            <div className="aspect-[4/5] bg-gray-200/70 animate-pulse" />
            <div className="aspect-[4/5] bg-gray-200/70 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200/70 animate-pulse w-3/4" />
            <div className="h-5 bg-gray-200/70 animate-pulse w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-2 md:pt-4 min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-600">The product you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const images: string[] = product.images || []
  const stockColor = isSoldOut ? '#9ca3af' : isLowStock ? '#f59e0b' : '#22c55e'
  const stockLabel = isSoldOut ? 'Sold out' : isLowStock ? 'Low stock' : 'In stock'

  return (
    <div className="pt-2 md:pt-4 min-h-screen bg-[#f7f7f5]">
      <div className="px-4 md:px-6 pb-10 md:pb-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
        {/* Left: 2-column image grid - ZERO gap */}
        <div className="grid grid-cols-2 gap-0 self-start">
          {images.length > 0 ? (
            images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className="block overflow-hidden cursor-zoom-in"
                aria-label={`View image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sanityImg(src, 900)}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </button>
            ))
          ) : (
            <div className="col-span-2 aspect-[4/5] bg-gray-200/70 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className="lg:sticky lg:top-[160px] self-start px-2 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-base text-gray-900">Rs. {fmt(product.price)}</p>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: stockColor, boxShadow: `0 0 0 3px ${stockColor}33` }}
            />
            <span className="text-sm text-gray-800">{stockLabel}</span>
          </div>

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-gray-800 mb-2.5">Color</div>
              <div className="flex gap-2.5">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === color ? 'border-black scale-110' : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size - full width evenly spread */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-gray-800 mb-2.5 text-center">Size</div>
              <div className="flex w-full items-center justify-between gap-1">
                {product.sizes.map((size: string) => {
                  const unavailable = unavailableSizes.map(String).includes(String(size))
                  return (
                    <button
                      key={size}
                      onClick={() => !unavailable && setSelectedSize(String(size))}
                      disabled={unavailable}
                      className={`flex-1 px-2 py-3.5 rounded-full text-sm font-medium transition-all duration-300 ease-out active:scale-95 ${
                        unavailable
                          ? 'text-gray-400 line-through cursor-not-allowed'
                          : selectedSize === String(size)
                          ? 'bg-black text-white shadow-md'
                          : 'text-gray-700 hover:text-black hover:bg-gray-200/60'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Outline buttons - hover black */}
          <div className="mt-8 space-y-2.5">
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="w-full bg-white border-2 border-gray-900 rounded-xl py-3.5 flex items-center justify-center gap-2 text-gray-900 font-medium hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
            >
              <BagPlusIcon size={18} /> Add to cart
            </button>
            <button
              onClick={buyNow}
              disabled={isSoldOut}
              className="w-full bg-white border-2 border-gray-900 rounded-xl py-3.5 text-gray-900 font-medium hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
            >
              Buy it now
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-8 border-t border-gray-300">
            <Accordion title="Description & Size Chart">
              {product.description ? (
                <PortableText
                  value={product.description}
                  components={{
                    block: {
                      h2: ({ children }) => <h2 className="text-base font-bold text-gray-900 mt-3 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-1">{children}</h3>,
                      normal: ({ children }) => <p className="mb-2">{children}</p>,
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      underline: ({ children }) => <span className="underline">{children}</span>,
                    },
                  }}
                />
              ) : (
                <p>No description available.</p>
              )}
            </Accordion>
            <Accordion title="Wash Care">
              <ul className="list-disc list-inside space-y-1">
                <li>Machine wash cold with like colors</li>
                <li>Do not bleach or tumble dry</li>
                <li>Iron on low heat, reverse side</li>
                <li>Do not dry clean</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      {/* You may also like - zero gap */}
      {related.length > 0 && (
        <section className="pb-10 md:pb-16">
          <div className="px-3 md:px-6 mb-2 md:mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
              You may also like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen lightbox */}
      {lightboxIdx !== null && images[lightboxIdx] && (
        <div className="fixed inset-0 z-[90] bg-[#4b4844]">
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-6 right-6 z-10 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-6 md:p-16 md:pr-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sanityImg(images[lightboxIdx], 1600)}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className={`w-14 h-[70px] md:w-16 md:h-20 overflow-hidden transition-all ${
                  lightboxIdx === i ? 'border-2 border-white' : 'border-2 border-transparent opacity-70 hover:opacity-100'
                }`}
                aria-label={`Image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sanityImg(src, 200)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}