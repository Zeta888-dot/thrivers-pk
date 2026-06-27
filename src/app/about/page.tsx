'use client'

import { motion } from 'framer-motion'
import { Shirt, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  const values = [
    { icon: Shirt, title: 'Premium Quality', desc: 'Crafted with the finest materials for everyday comfort.' },
    { icon: Globe, title: 'From Chitral', desc: 'Proudly representing the beauty and culture of the north.' },
    { icon: Heart, title: 'Made with Love', desc: 'Every stitch tells a story of passion and dedication.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Story</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thrivers was born out of a passion for premium streetwear and a love for our roots.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: index * 0.1 }} 
            className="p-6 bg-gray-50 rounded-xl text-center"
          >
            <item.icon className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}