'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { MessageCircle, Truck } from 'lucide-react'
import { sanityImg } from '@/lib/sanity'

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'whatsapp'>('cod')
  const [loading, setLoading] = useState(false)

  const deliveryCharge = 300
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const grandTotal = total + deliveryCharge

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      altPhone: formData.altPhone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      items,
      subtotal: total,
      deliveryCharge: deliveryCharge,
      totalAmount: grandTotal,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'WhatsApp Order',
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (paymentMethod === 'whatsapp' && data.whatsappLink) {
        window.open(data.whatsappLink, '_blank')
      }

      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      console.error('Order failed:', error)
      alert('Order place karne mein error aaya. Dobara try karein.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-6 md:pt-10 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cart is empty</h1>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  const inputCls =
    'w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black transition-colors'

  return (
    <div className="pt-6 md:pt-10 min-h-screen bg-white">
      <div className="px-4 md:px-10 xl:px-16 pb-16 md:pb-24">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-8 md:mb-10">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 xl:gap-12"
        >
          {/* LEFT - form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 mb-4">
                Contact
              </h2>
              <div className="space-y-3">
                <input
                  required
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputCls}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    placeholder="Alt Phone"
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 mb-4">
                Shipping
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <textarea
                  required
                  placeholder="Full delivery address *"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 mb-4">
                Payment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-black bg-white'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      paymentMethod === 'cod' ? 'border-black' : 'border-gray-400'
                    }`}
                  >
                    {paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <Truck size={18} className="text-gray-800" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Cash on Delivery</div>
                    <div className="text-xs text-gray-600">Pay when you receive</div>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-black bg-white'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      paymentMethod === 'whatsapp' ? 'border-black' : 'border-gray-400'
                    }`}
                  >
                    {paymentMethod === 'whatsapp' && <span className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <MessageCircle size={18} className="text-gray-800" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Order via WhatsApp</div>
                    <div className="text-xs text-gray-600">Confirm order on chat</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside className="lg:sticky lg:top-[180px] self-start bg-[#e9ece7] rounded-[20px] p-6 md:p-7">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 pb-4 border-b border-gray-400/40">
              {items.map((item, index) => (
                <div key={item.id || index} className="flex gap-4">
                  <div className="w-16 h-20 bg-white/70 overflow-hidden shrink-0">
                    {item.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sanityImg(item.images[0], 200)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-gray-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-700 mt-0.5">
                      Qty {item.quantity}
                      {item.size && <> · {item.size}</>}
                    </div>
                    <div className="text-[14px] text-gray-900 mt-1">Rs. {fmt(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-4 space-y-2 border-b border-gray-400/40">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>Rs. {fmt(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery</span>
                <span>Rs. {fmt(deliveryCharge)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-4">
              <span className="text-[15px] font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">Rs. {fmt(grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black text-white rounded-xl py-4 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing…' : 'Place order'}
            </button>
          </aside>
        </form>
      </div>
    </div>
  )
}