'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f5] text-gray-900">
      {/* Giant logo - northstory jaisa full-width */}
      <div className="px-3 md:px-6 pt-16 md:pt-28 pb-8 md:pb-14">
        <svg
          viewBox="0 0 1000 265"
          className="w-full h-auto text-black"
          aria-label="Thrivers"
          role="img"
        >
          <text
            x="0"
            y="250"
            fontSize="255"
            fill="currentColor"
            style={{ fontFamily: 'var(--font-archivo-black), sans-serif' }}
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
          >
            THRIVERS
          </text>
          <text
            x="880"
            y="70"
            fontSize="95"
            fill="currentColor"
            style={{ fontFamily: 'var(--font-archivo-black), sans-serif' }}
          >
            ™
          </text>
        </svg>
      </div>

      {/* Sage footer content */}
      <div className="bg-[#e9ece7]">
        <div className="px-6 md:px-10 xl:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-700 max-w-sm">
                Premium streetwear from Chitral, Pakistan. Quality meets culture.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://www.instagram.com/thrivers.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-gray-500/50 rounded-full hover:bg-black hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="mailto:sheikhinsaan07@gmail.com"
                  className="p-2 border border-gray-500/50 rounded-full hover:bg-black hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail size={18} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-gray-500 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-gray-500 transition-colors">Contact Us</Link></li>
                <li><Link href="/shop" className="hover:text-gray-500 transition-colors">Collections</Link></li>
                <li><Link href="/contact" className="hover:text-gray-500 transition-colors">Return & Exchanges</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:sheikhinsaan07@gmail.com" className="hover:text-gray-500 transition-colors">
                    sheikhinsaan07@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+923439766306" className="hover:text-gray-500 transition-colors">
                    +92 343 9766306
                  </a>
                </li>
                <li className="text-gray-700">Hayat Market, New Bazar, Chitral</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-gray-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-700">
            <span>© {new Date().getFullYear()} Thrivers PK. All rights reserved.</span>
            <span className="tracking-widest uppercase">Not Survivors — Thrivers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}