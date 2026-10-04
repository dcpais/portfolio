export default function ViewModeToggle({ label, onClick, tone = 'sun' }) {
  const toneClasses =
    tone === 'sun'
      ? 'border-sun/60 text-sun hover:bg-sun/15'
      : 'border-glow/60 text-glow hover:bg-glow/10'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed right-4 top-4 z-40 rounded-full border-2 bg-abyss/85 px-4 py-2 font-display text-xs font-semibold backdrop-blur transition-transform hover:scale-105 ${toneClasses}`}
    >
      {label}
    </button>
  )
}
