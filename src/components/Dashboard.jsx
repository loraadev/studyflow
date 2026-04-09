import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import { formatMinutes, formatHours } from '../utils/formatTime'
import { todayKey, getGreeting } from '../utils/dateHelpers'

const MOTIVS = [
  'Cada hora de estudo é um investimento no seu futuro. <b>Continue firme!</b>',
  'A disciplina hoje cria a liberdade de amanhã. <b>Você está no caminho certo.</b>',
  'O sucesso é a soma de pequenos esforços repetidos. <b>Uma sessão de cada vez.</b>',
  'Foque no processo — os resultados vêm naturalmente. <b>Parabéns pela consistência!</b>',
  'Seu futuro eu vai agradecer o esforço de hoje. <b>Não pare agora!</b>',
]

export default function Dashboard() {
  const { tasks, sessions, settings } = useApp()

  const today = todayKey()
  const dailyGoal = settings?.daily_goal_minutes ?? 240

  const todayMins = useMemo(
    () => sessions.filter(s => s.studied_at === today).reduce((a, b) => a + b.duration_minutes, 0),
    [sessions, today]
  )

  const weekMins = useMemo(() => {
    const start = new Date()
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    return sessions
      .filter(s => new Date(s.studied_at + 'T00:00:00') >= start)
      .reduce((a, b) => a + b.duration_minutes, 0)
  }, [sessions])

  const tasksDone = tasks.filter(t => t.done).length
  const motiv = useMemo(() => MOTIVS[Math.floor(Math.random() * MOTIVS.length)], []) //uso randomico, gera um valor aleatório que não muda quando o componente atualiza

  const recentSessions = sessions.slice(0, 6)

  // Distribuição por disciplina
  const bySubject = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      map[s.subject] = (map[s.subject] ?? 0) + s.duration_minutes
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [sessions])

  const now = new Date()
  const dateLabel = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <main className="flex-1 overflow-y-auto p-7 bg-gray-50" aria-label="Dashboard">
      {/* Cabeçalho */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          {getGreeting()}! Pronto para estudar?
        </h1>
        <p className="text-sm text-gray-400 capitalize">{dateLabel}</p>
      </header>

      {/* Banner motivacional */}
      <div
        className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6"
        role="note"
        aria-label="Mensagem motivacional"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white text-sm">
          ✦
        </div>
        <p
          className="text-sm text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: motiv }}
        />
      </div>

      {/* Cards de métricas */}
      <section aria-label="Métricas do dia" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Card ariaLabel="Horas estudadas hoje">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Hoje</p>
          <p className="text-2xl font-semibold text-blue-600 font-mono">{formatMinutes(todayMins)}</p>
          <ProgressBar value={todayMins} max={dailyGoal} />
          <p className="text-xs text-gray-400 mt-1.5">
            {Math.min(100, Math.round((todayMins / dailyGoal) * 100))}% da meta
          </p>
        </Card>

        <Card ariaLabel="Sequência de dias">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sequência</p>
          <p className="text-2xl font-semibold text-yellow-500 font-mono">{settings?.streak ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1.5">dias consecutivos</p>
        </Card>

        <Card ariaLabel="Tarefas concluídas">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Tarefas</p>
          <p className="text-2xl font-semibold text-green-600 font-mono">{tasksDone}/{tasks.length}</p>
          <p className="text-xs text-gray-400 mt-1.5">concluídas hoje</p>
        </Card>

        <Card ariaLabel="Horas na semana">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Esta semana</p>
          <p className="text-2xl font-semibold text-gray-800 font-mono">{formatHours(weekMins)}</p>
          <p className="text-xs text-gray-400 mt-1.5">horas estudadas</p>
        </Card>
      </section>

      {/* Distribuição + Sessões recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card ariaLabel="Distribuição por disciplina">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Por disciplina</h2>
          {bySubject.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhuma sessão registrada ainda</p>
          ) : (
            <ul className="space-y-3">
              {bySubject.map(([subject, mins]) => (
                <li key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{subject}</span>
                    <span className="text-gray-400 font-mono">{formatMinutes(mins)}</span>
                  </div>
                  <ProgressBar
                    value={mins}
                    max={bySubject[0][1]}
                    color="bg-blue-500"
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card ariaLabel="Sessões recentes">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Sessões recentes</h2>
          {recentSessions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhuma sessão ainda</p>
          ) : (
            <ul className="space-y-2.5">
              {recentSessions.map(s => (
                <li key={s.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true"/>
                  <span className="flex-1 text-sm font-medium text-gray-700">{s.subject}</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-mono">
                    {formatMinutes(s.duration_minutes)}
                  </span>
                  <span className="text-xs text-gray-300">
                    {s.studied_at?.slice(5).replace('-', '/')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  )
}