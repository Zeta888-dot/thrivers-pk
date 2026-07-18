'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* THRIVERS - Font Applied & Spacing CRUSHED */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-0 leading-none tracking-tight font-archivo-black">
            THRIVERS
          </h1>
          
          {/* Not Survivors - Brought as close as possible */}
          <p className="text-2xl md:text-3xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium tracking-wide mt-1">
            Not Survivors
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#950606] text-white font-semibold rounded-full hover:bg-[#7a0505] transition-all hover:scale-105"
            >
              Shop Now
              <ArrowRight size={20} />
            </Link>
            
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full border-2 border-[#950606] hover:bg-[#7a0505] hover:text-white transition-all"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-black/5 rounded-full"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-black/5 rounded-full"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </section>
  )
}