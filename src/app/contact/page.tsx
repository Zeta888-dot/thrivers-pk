import Link from 'next/link'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Thrivers PK - Chitral, Pakistan.',
}

const blocks = [
  {
    title: 'Email',
    lines: ['sheikhinsaan07@gmail.com'],
    href: 'mailto:sheikhinsaan07@gmail.com',
    cta: 'Write to us',
  },
  {
    title: 'Phone / WhatsApp',
    lines: ['+92 343 9766306'],
    href: 'https://wa.me/923439766306',
    cta: 'Chat on WhatsApp',
  },
  {
    title: 'Store',
    lines: ['Hayat Market, New Bazar', 'Chitral, Pakistan'],
    href: 'https://www.instagram.com/thrivers.pk',
    cta: 'Instagram',
  },
]

export default function ContactPage() {
  return (
    <div className="pt-6 md:pt-16 min-h-screen bg-white">
      <div className="px-6 md:px-10 xl:px-16 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Contact
          </span>
          <h1 className="mt-4 font-archivo-black text-4xl md:text-5xl text-gray-900 tracking-tight">
            GET IN TOUCH
          </h1>
          <p className="mt-6 text-[15px] md:text-base text-gray-700">
            Orders, sizing, returns or just saying salami - we reply fast.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {blocks.map((b) => (
            <div key={b.title} className="bg-[#e9ece7] rounded-[20px] p-8 flex flex-col">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900">
                {b.title}
              </h3>
              <div className="mt-4 space-y-1">
                {b.lines.map((l) => (
                  <p key={l} className="text-[15px] text-gray-800">
                    {l}
                  </p>
                ))}
              </div>
              <div className="flex-1" />
              <a
                href={b.href}
                target={b.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="mt-8 inline-block bg-white border-2 border-gray-900 rounded-xl py-3 text-center text-sm font-medium text-gray-900 hover:bg-black hover:text-white transition-colors duration-300"
              >
                {b.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-14 text-center">
          <p className="text-sm text-gray-600">
            Order updates aur tracking ke liye WhatsApp sab se tez hai.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-6 bg-black text-white px-10 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}