'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const CheckIcon = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export default function SuccessPage() {
  return (
    <div className="pt-6 md:pt-10 min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#e9ece7] flex items-center justify-center text-gray-900">
            <CheckIcon size={44} />
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Order placed
        </h1>
        <p className="mt-4 text-[15px] text-gray-700">
          Thank you for your order. We will confirm via phone/WhatsApp shortly.
        </p>

        <div className="mt-10 text-left">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-900 mb-5">
            What&apos;s next
          </h2>
          <div className="space-y-3">
            {[
              'We will confirm your order via phone/WhatsApp',
              'Our team will contact you within 24 hours',
              'Delivery within 3-5 business days across Pakistan',
            ].map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-[#f4f4f2] rounded-xl px-5 py-4"
              >
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-[15px] text-gray-800">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white border-2 border-gray-900 text-gray-900 px-8 py-3.5 rounded-xl font-medium hover:bg-black hover:text-white transition-colors duration-300"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}