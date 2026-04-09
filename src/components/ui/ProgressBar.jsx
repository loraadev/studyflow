// Barra de progresso acessível
export default function ProgressBar({ value = 0, max = 100, color = 'bg-blue-600' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${pct}% concluído`}
      className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-3"
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}