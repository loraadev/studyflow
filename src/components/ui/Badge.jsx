// Badge de prioridade com cores semânticas
const styles = {
  high: 'bg-red-50 text-red-600',
  med:  'bg-yellow-50 text-yellow-700',
  low:  'bg-green-50 text-green-600',
}

const labels = {
  high: 'Alta',
  med:  'Média',
  low:  'Baixa',
}

export default function Badge({ priority }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}
      aria-label={`Prioridade ${labels[priority]}`}
    >
      {labels[priority]}
    </span>
  )
}