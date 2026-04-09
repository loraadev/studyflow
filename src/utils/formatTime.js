// Converte minutos em formato legível: 90 → "1h 30m"
export function formatMinutes(minutes) {
  if (!minutes || minutes <= 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${String(m).padStart(2, '0')}m`
}

// Converte minutos em horas decimais: 90 → "1.5h"
export function formatHours(minutes) {
  if (!minutes || minutes <= 0) return '0h'
  const h = minutes / 60
  return h >= 1
    ? h.toFixed(1).replace(/\.0$/, '') + 'h'
    : Math.round(minutes) + 'min'
}

// Converte segundos em HH:MM:SS para o timer
export function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}