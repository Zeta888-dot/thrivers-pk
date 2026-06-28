import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#950606] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Thrivers</h3>
            <p className="text-red-100 text-sm">
              Premium streetwear from the heart of Chitral. Quality meets culture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-red-100">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-red-100">
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Main Bazaar, Chitral</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>hello@thrivers.pk</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Facebook">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Twitter">
                <FaTwitter size={18} />
              </a>
            </div>
            <p className="text-xs text-red-200 mt-3">
              @thrivers.pk
            </p>
          </div>
        </div>

        <div className="border-t border-red-400/30 mt-8 pt-8 text-center text-sm text-red-100">
          <p>&copy; 2026 Thrivers PK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
