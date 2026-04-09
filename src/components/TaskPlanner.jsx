import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'

const PRIORITY_ORDER = { high: 0, med: 1, low: 2 }

export default function TaskPlanner() {
  const { tasks, addTask, checkTask, removeTask } = useApp()
  const [name, setName]       = useState('')
  const [minutes, setMinutes] = useState('')
  const [priority, setPriority] = useState('med')
  const [saving, setSaving]   = useState(false)
  const [fieldError, setFieldError] = useState('')

  const sorted = [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  )
  const doneCount = tasks.filter(t => t.done).length

  async function handleAdd() {
    if (!name.trim()) { setFieldError('Digite o nome da disciplina.'); return }
    if (!minutes || Number(minutes) < 1) { setFieldError('Digite uma duração válida.'); return }
    setFieldError('')
    setSaving(true)
    try {
      await addTask({
        name: name.trim(),
        duration_minutes: Number(minutes),
        priority,
      })
      setName('')
      setMinutes('')
      setPriority('med')
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <main className="flex-1 overflow-y-auto p-7 bg-gray-50" aria-label="Planejamento de estudos">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Planejamento</h1>
        <p className="text-sm text-gray-400">Organize suas tarefas por prioridade.</p>
      </header>

      {/* Formulário */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Nova tarefa</h2>

        {fieldError && (
          <p role="alert" className="text-xs text-red-500 mb-3">{fieldError}</p>
        )}

        <div className="flex flex-wrap gap-2.5">
          <input
            type="text"
            placeholder="Disciplina ou tema..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Nome da disciplina"
            className="flex-1 min-w-44 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <input
            type="number"
            placeholder="Duração (min)"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            onKeyDown={handleKeyDown}
            min={1}
            max={480}
            aria-label="Duração em minutos"
            className="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            aria-label="Prioridade da tarefa"
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          >
            <option value="high">🔴 Alta prioridade</option>
            <option value="med">🟡 Média prioridade</option>
            <option value="low">🟢 Baixa prioridade</option>
          </select>
          <Button variant="primary" onClick={handleAdd} disabled={saving} ariaLabel="Adicionar tarefa">
            {saving ? 'Salvando...' : '+ Adicionar'}
          </Button>
        </div>
      </Card>

      {/* Lista */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Lista de tarefas</h2>
          <span className="text-xs text-gray-400">{doneCount} de {tasks.length} concluídas</span>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhuma tarefa criada ainda.</p>
        ) : (
          <ul role="list" aria-label="Lista de tarefas">
            {sorted.map(task => (
              <li
                key={task.id}
                className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 group"
              >
                {/* Checkbox */}
                <button
                  onClick={() => checkTask(task.id, !task.done)}
                  aria-label={task.done ? `Marcar ${task.name} como pendente` : `Concluir ${task.name}`}
                  className={`
                    w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center
                    transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${task.done
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-blue-400'}
                  `}
                >
                  {task.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <path d="M1.5 5l2.5 2.5L8.5 2"/>
                    </svg>
                  )}
                </button>

                <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-300' : 'text-gray-700 font-medium'}`}>
                  {task.name}
                </span>

                <Badge priority={task.priority} />

                <span className="text-xs text-gray-300 font-mono bg-gray-50 px-2 py-0.5 rounded">
                  {task.duration_minutes}min
                </span>

                <button
                  onClick={() => removeTask(task.id)}
                  aria-label={`Remover tarefa ${task.name}`}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all focus:opacity-100 focus:outline-none text-lg leading-none px-1"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  )
}