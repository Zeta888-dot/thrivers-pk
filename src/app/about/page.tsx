import Link from 'next/link'

export const metadata = {
  title: 'Brand Story',
  description: 'Thrivers PK - premium streetwear brand from Chitral, Pakistan. Not survivors - thrivers.',
}

export default function AboutPage() {
  return (
    <div className="pt-6 md:pt-16 min-h-screen bg-white">
      <div className="px-6 md:px-10 xl:px-16 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Brand Story
          </span>
          <h1 className="mt-4 font-archivo-black text-4xl md:text-6xl text-gray-900 leading-tight tracking-tight">
            NOT SURVIVORS.
            <br />
            THRIVERS.
          </h1>
          <p className="mt-8 text-[17px] md:text-lg text-gray-700 leading-relaxed">
            Born in the mountains of Chitral, Thrivers PK is more than clothing - it is a
            statement. Every piece we make carries the spirit of people who do not just
            survive their circumstances, they thrive in them.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-16 md:mt-24 space-y-6 text-[15px] md:text-base text-gray-700 leading-relaxed">
          <p>
            We started with a simple belief: premium streetwear should not be limited to
            big cities. From oversized tees to handcrafted crochet shirts, every Thrivers
            piece is designed with intention - heavy fabrics, clean cuts, and details that
            speak louder than logos.
          </p>
          <p>
            Each drop is limited. Each design tells a story of culture, struggle and
            ambition. When you wear Thrivers, you wear the proof that where you start
            does not decide where you finish.
          </p>
        </div>

        {/* Values */}
        <div className="max-w-3xl mx-auto mt-16 md:mt-24 border-t border-gray-200">
          {[
            {
              title: 'Quality First',
              text: 'Heavyweight fabrics and stitched-to-last construction. No shortcuts, ever.',
            },
            {
              title: 'Culture & Craft',
              text: 'Designed in Chitral - inspired by the mountains, the people and the hustle.',
            },
            {
              title: 'Limited Drops',
              text: 'Small batches only. When a drop is gone, it is gone for good.',
            },
          ].map((v) => (
            <div
              key={v.title}
              className="py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-2 md:gap-10"
            >
              <h3 className="text-sm font-bold tracking-widest uppercase text-gray-900 md:w-48 shrink-0">
                {v.title}
              </h3>
              <p className="text-[15px] text-gray-600">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-10 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Shop the drop
          </Link>
        </div>
      </div>
    </div>
  )
}