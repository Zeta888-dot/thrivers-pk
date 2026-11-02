'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  const phone = '923439766306'
  const message = 'Hi Thrivers PK! I have a question about my order.'

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-72 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  T
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Thrivers PK</div>
                  <div className="text-xs text-gray-600">Usually replies in minutes</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Order update, sizing ya kuch bhi - WhatsApp pe baat karein.
              </p>
              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-black text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Start chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1ebe5b] active:scale-95 md:h-14 md:w-14"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} aria-hidden="true" />
      </button>
    </div>
  )
}