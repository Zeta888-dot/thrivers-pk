'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
    setTimeout(() => setIsSent(false), 3000)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600">Have a question? We'd love to hear from you.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full"><MapPin className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-lg">Visit Us</h3>
              <p className="text-gray-600">Main Bazaar, Chitral, Pakistan</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full"><Phone className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-lg">Call Us</h3>
              <p className="text-gray-600">+92 300 1234567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full"><Mail className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-lg">Email Us</h3>
              <p className="text-gray-600">hello@thrivers.pk</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-gray-50 p-8 rounded-xl"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea 
              required 
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-[#950606] text-white py-3 rounded-lg font-semibold hover:bg-[#7a0505] transition-colors"
          >
            {isSent ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
          </button>
        </motion.form>
      </div>
    </div>
  )
}
