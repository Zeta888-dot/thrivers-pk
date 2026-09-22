export default function ScribbleLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 430 115" className={className} fill="none" aria-label="Thrivers" role="img">
      <text
        x="10"
        y="74"
        fontSize="64"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-marker), cursive' }}
        transform="rotate(-3 215 55)"
      >
        THRIVERS
      </text>
      {/* underline swash */}
      <path
        d="M16 94 C 130 82, 310 100, 414 86"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* top-right accent slash */}
      <path d="M382 20 l 30 -10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}