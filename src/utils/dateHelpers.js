// Retorna a data de hoje no formato YYYY-MM-DD
export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

// Retorna uma data N dias atrás no formato YYYY-MM-DD
export function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// Retorna array com os últimos N dias no formato YYYY-MM-DD
export function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => daysAgo(n - 1 - i))
}

// Formata data para exibição: "2024-04-09" → "09/04"
export function formatDateShort(dateStr) {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

// Retorna saudação baseada na hora do dia
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}