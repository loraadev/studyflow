import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useTimer } from '../hooks/useTimer'
import Card from './ui/Card'
import Button from './ui/Button'
import { formatTimer, formatMinutes } from '../utils/formatTime'

export default function StudyTimer() {
  const { tasks, sessions, addSession } = useApp()
  const [subject, setSubject] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [pomoEnabled, setPomoEnabled] = useState(false)

  const {
    seconds, running, paused,
    phase, cycle,
    start, pause, stop, reset,
    checkPomodoro,
    POMODORO_FOCUS,
  } = useTimer()

  // Verifica pomodoro a cada tick
  useEffect(() => {
    if (pomoEnabled && running && !paused) checkPomodoro()
  }, [seconds, pomoEnabled, running, paused, checkPomodoro])

  // Disciplinas vindas das tarefas
  const subjects = [...new Set(tasks.map(t => t.name))]

  // Sessões de hoje
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter(s => s.studied_at === today)

  async function handleStop() {
    const mins = stop()
    if (!subject) {
      reset()
      return
    }
    setSaving(true)
    try {
      await addSession({ subject, duration_minutes: mins })
      setLastSaved({ subject, mins })
    } finally {
      setSaving(false)
    }
  }

  // Cor do display
  const displayColor = running && !paused
    ? 'text-blue-600'
    : paused
    ? 'text-yellow-500'
    : 'text-gray-800'

  // Texto de status
  let statusLabel = 'Selecione uma disciplina e comece'
  if (saving) {
    statusLabel = 'Salvando sessão...'
  } else if (lastSaved && !running) {
    statusLabel = `✓ ${lastSaved.mins}min de ${lastSaved.subject} salvos!`
  } else if (running && !paused) {
    if (pomoEnabled) {
      statusLabel = phase === 'focus' ? '🍅 Foco — 25 minutos' : '☕ Pausa — 5 minutos'
    } else {
      statusLabel = 'Em andamento... foco total!'
    }
  } else if (paused) {
    statusLabel = 'Pausado — clique em Retomar'
  }

  // Progresso do pomodoro
  const pomoDuration = phase === 'focus' ? POMODORO_FOCUS : 5 * 60
  const phaseStart = cycle * (POMODORO_FOCUS + 5 * 60) +
    (phase === 'break' ? POMODORO_FOCUS : 0)
  const pomoProgress = pomoEnabled
    ? Math.min(100, Math.round(((seconds - phaseStart) / pomoDuration) * 100))
    : 0

  return (
    <main
      className="flex-1 overflow-y-auto p-7 bg-gray-50"
      aria-label="Timer de estudos"
    >
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Timer</h1>
        <p className="text-sm text-gray-400">Registre seu tempo com foco total.</p>
      </header>

      {/* Card principal do timer */}
      <Card className="mb-4 text-center">

        {/* Display do tempo */}
        <div
          className={`text-7xl font-light tracking-tighter font-mono mb-2 transition-colors duration-300 ${displayColor}`}
          role="timer"
          aria-live="polite"
          aria-label={`Tempo decorrido: ${formatTimer(seconds)}`}
        >
          {formatTimer(seconds)}
        </div>

        {/* Status */}
        <p className="text-sm text-gray-400 mb-6 min-h-5 font-medium">
          {statusLabel}
        </p>

        {/* Seleção de disciplina */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={running}
            aria-label="Selecionar disciplina"
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Selecionar disciplina...</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Botões de controle */}
        <div
          className="flex gap-2.5 justify-center mb-7"
          role="group"
          aria-label="Controles do timer"
        >
          <Button
            variant="primary"
            onClick={start}
            disabled={running && !paused}
            ariaLabel="Iniciar timer"
          >
            ▶ {paused ? 'Retomar' : 'Iniciar'}
          </Button>
          <Button
            onClick={pause}
            disabled={!running || paused}
            ariaLabel="Pausar timer"
          >
            ⏸ Pausar
          </Button>
          <Button
            variant="danger"
            onClick={handleStop}
            disabled={!running && !paused}
            ariaLabel="Finalizar sessão"
          >
            ■ Finalizar
          </Button>
        </div>

        {/* Seção Pomodoro */}
        <div className="border-t border-gray-50 pt-5">
          <div className="flex items-center justify-center gap-3 flex-wrap">

            {/* Toggle */}
            <button
              onClick={() => setPomoEnabled(p => !p)}
              disabled={running}
              aria-pressed={pomoEnabled}
              aria-label="Ativar modo Pomodoro"
              className={`
                w-10 h-5 rounded-full relative transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50
                ${pomoEnabled ? 'bg-blue-600' : 'bg-gray-200'}
              `}
            >
              <span className={`
                absolute top-0.5 w-4 h-4 bg-white rounded-full shadow
                transition-all duration-200
                ${pomoEnabled ? 'left-5' : 'left-0.5'}
              `}/>
            </button>

            <span className="text-sm text-gray-500 font-medium">
              Modo Pomodoro
            </span>

            {/* Dots dos ciclos */}
            <div className="flex gap-1.5" aria-label={`${cycle} ciclos completos`}>
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${i < cycle
                      ? 'bg-blue-600'
                      : i === cycle && running
                      ? 'bg-blue-400 ring-2 ring-blue-200'
                      : 'bg-gray-200'}
                  `}
                />
              ))}
            </div>

            {pomoEnabled && running && (
              <span className="text-xs text-gray-400">
                {phase === 'focus'
                  ? `${pomoProgress}% do foco`
                  : `${pomoProgress}% da pausa`}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Sessões de hoje */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-800 mb-4">
          Sessões de hoje
        </h2>

        {todaySessions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Nenhuma sessão hoje ainda.
          </p>
        ) : (
          <ul className="space-y-2.5" aria-label="Sessões de hoje">
            {todaySessions.map(s => (
              <li key={s.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full bg-blue-500 shrink-0"
                  aria-hidden="true"
                />
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {s.subject}
                </span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-mono">
                  {formatMinutes(s.duration_minutes)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  )
}