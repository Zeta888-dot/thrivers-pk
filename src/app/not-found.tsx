import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="pt-6 md:pt-16 min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="font-archivo-black text-[120px] md:text-[160px] text-gray-900 leading-none tracking-tighter">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
          Page not found
        </h1>
        <p className="mt-3 text-[15px] text-gray-700">
          Jo dhundh rahe ho wo ab yahan nahi hai.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-white border-2 border-gray-900 text-gray-900 px-8 py-3.5 rounded-xl font-medium hover:bg-black hover:text-white transition-colors duration-300"
          >
            Browse shop
          </Link>
        </div>
      </div>
    </div>
  )
}