import { useState, useEffect, useRef, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import Card from './ui/Card'
import { formatMinutes, formatHours } from '../utils/formatTime'
import { lastNDays, formatDateShort } from '../utils/dateHelpers'

const COLORS = ['#2D5BE3','#1A7A54','#B86A0A','#C13B2A','#7B4FC4','#0F7EA8']

export default function Reports() {
  const { sessions } = useApp()
  const [period, setPeriod] = useState(7)
  const barRef = useRef(null)
  const doughRef = useRef(null)
  const barChart = useRef(null)
  const doughChart = useRef(null)

  const days = lastNDays(period)

  const barData = useMemo(() => days.map(day => ({
    label: formatDateShort(day),
    mins: sessions
      .filter(s => s.studied_at === day)
      .reduce((a, b) => a + b.duration_minutes, 0),
  })), [days, sessions])

  const bySubject = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      map[s.subject] = (map[s.subject] ?? 0) + s.duration_minutes
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [sessions])

  const totalMins = sessions.reduce((a, b) => a + b.duration_minutes, 0)
  const nonZeroDays = barData.filter(d => d.mins > 0)
  const avgMins = nonZeroDays.length
    ? Math.round(nonZeroDays.reduce((a, b) => a + b.mins, 0) / nonZeroDays.length)
    : 0

  // Renderiza gráfico de barras
  useEffect(() => {
    if (!barRef.current) return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      if (barChart.current) barChart.current.destroy()
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: barData.map(d => d.label),
          datasets: [{
            data: barData.map(d => parseFloat((d.mins / 60).toFixed(2))),
            backgroundColor: barData.map((_, i) =>
              i === barData.length - 1 ? '#2D5BE3' : '#B8C8F8'
            ),
            borderRadius: 7,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,.04)' },
              ticks: { callback: v => v + 'h', font: { size: 10 } },
            },
          },
        },
      })
    })
    return () => { if (barChart.current) barChart.current.destroy() }
  }, [barData])

  // Renderiza gráfico de rosca
  useEffect(() => {
    if (!doughRef.current || bySubject.length === 0) return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      if (doughChart.current) doughChart.current.destroy()
      doughChart.current = new Chart(doughRef.current, {
        type: 'doughnut',
        data: {
          labels: bySubject.map(([s]) => s),
          datasets: [{
            data: bySubject.map(([, m]) => parseFloat((m / 60).toFixed(2))),
            backgroundColor: COLORS.slice(0, bySubject.length),
            borderWidth: 0,
            hoverOffset: 5,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 12, font: { size: 11 }, boxWidth: 10, usePointStyle: true },
            },
          },
        },
      })
    })
    return () => { if (doughChart.current) doughChart.current.destroy() }
  }, [bySubject])

  return (
    <main className="flex-1 overflow-y-auto p-7 bg-gray-50" aria-label="Relatórios de estudo">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-400">Visualize sua evolução ao longo do tempo.</p>
      </header>

      {/* Tabs de período */}
      <div
        className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg mb-5 border border-gray-200"
        role="tablist"
        aria-label="Período do relatório"
      >
        {[{ label: 'Semana', value: 7 }, { label: 'Mês', value: 30 }].map(opt => (
          <button
            key={opt.value}
            role="tab"
            aria-selected={period === opt.value}
            onClick={() => setPeriod(opt.value)}
            className={`
              px-4 py-1.5 rounded-md text-xs font-medium transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${period === opt.value
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Horas por dia</h2>
          <div className="relative h-52">
            <canvas ref={barRef} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Por disciplina</h2>
          {bySubject.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">Sem dados ainda.</p>
          ) : (
            <div className="relative h-52">
              <canvas ref={doughRef} />
            </div>
          )}
        </Card>
      </div>

      {/* Resumo */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Resumo geral</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total acumulado', value: formatHours(totalMins), color: 'text-blue-600' },
            { label: 'Média diária', value: formatMinutes(avgMins), color: 'text-gray-800' },
            { label: 'Disciplina top', value: bySubject[0]?.[0] ?? '—', color: 'text-gray-800' },
            { label: 'Total de sessões', value: String(sessions.length), color: 'text-green-600' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{item.label}</p>
              <p className={`text-xl font-semibold font-mono ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}