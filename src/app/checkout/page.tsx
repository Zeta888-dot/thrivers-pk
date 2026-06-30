'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { MessageCircle, Truck } from 'lucide-react'

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
    postalCode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'whatsapp'>('cod')
  const [loading, setLoading] = useState(false)

  // Apna WhatsApp number yahan daalein (country code ke saath, bina + ke)
  const BUSINESS_PHONE = "923001234567" 

  // Total manually calculate karo
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
      totalAmount: total,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'WhatsApp Order'
    }

    try {
      // 1. Save to Sanity
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      // 2. WhatsApp Logic
      if (paymentMethod === 'whatsapp') {
        const message = `*New Order from Thrivers PK*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Alt Phone:* ${formData.altPhone}%0A*Email:* ${formData.email}%0A*Address:* ${formData.address}%0A*City:* ${formData.city}%0A*Postal Code:* ${formData.postalCode}%0A%0A*Items:*%0A${items.map(i => `- ${i.name} (x${i.quantity}) - PKR ${i.price}`).join('%0A')}%0A%0A*Total: PKR ${total}*`
        window.open(`https://wa.me/${BUSINESS_PHONE}?text=${message}`, '_blank')
      }

      // Clear cart and redirect
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      console.error("Order failed:", error)
      alert("Order place karne mein error aaya. Dobara try karein.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return <div className="py-20 text-center">Cart is empty</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input required placeholder="Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input required placeholder="Phone Number *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input placeholder="Alternative Phone Number" value={formData.altPhone} onChange={e => setFormData({...formData, altPhone: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input required placeholder="City *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input placeholder="Postal Code" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full p-3 border rounded-lg" />
          <textarea required placeholder="Delivery Address *" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 border rounded-lg" rows={3} />
          
          <div className="space-y-2 pt-4">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <Truck size={20} /> Cash on Delivery (COD)
            </label>
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payment" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} />
              <MessageCircle size={20} /> Order via WhatsApp
            </label>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {items.map((item, index) => (
            <div key={item.id || index} className="flex justify-between py-2 border-b">
              <span>{item.name} x {item.quantity}</span>
              <span>PKR {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>PKR {total}</span>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-6 bg-[#950606] text-white py-3 rounded-lg font-semibold hover:bg-[#7a0505] disabled:opacity-50">
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}