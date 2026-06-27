'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { CreditCard, Truck, Shield } from 'lucide-react'

export default function CheckoutPage() {
  const { items } = useCartStore()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', postalCode: '',
    cardNumber: '', expiry: '', cvv: ''
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 300
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-6">🎉</motion.div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">Thank you for your order. We'll contact you soon.</p>
        <a href="/shop" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold">Continue Shopping</a>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <a href="/shop" className="text-black underline">Go to Shop</a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" required 
                value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
              <input type="email" placeholder="Email" required 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
              <input type="tel" placeholder="Phone" required 
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Address" required 
                value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" required 
                  value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
                <input type="text" placeholder="Postal Code" required 
                  value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Card Number" required 
                value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" required 
                  value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
                <input type="text" placeholder="CVV" required 
                  value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors">
            Complete Order
          </button>
        </motion.form>

        {/* Order Summary */}
        <motion.div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `PKR ${shipping}`}</span></div>
            <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>PKR {total.toLocaleString()}</span></div>
          </div>
          
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Truck size={16} /> Free shipping over PKR 5,000</div>
            <div className="flex items-center gap-2"><Shield size={16} /> Secure payment</div>
            <div className="flex items-center gap-2"><CreditCard size={16} /> Cash on delivery available</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}