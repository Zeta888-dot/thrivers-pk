'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order! We'll process it soon and get back to you.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <ul className="text-left space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="bg-[#950606] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
              <span>We'll confirm your order via phone/WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#950606] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
              <span>Our team will contact you within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#950606] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
              <span>Delivery within 3-5 business days</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#950606] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7a0505] transition-colors"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            Go to Home
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}