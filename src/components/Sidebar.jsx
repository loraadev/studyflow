import { useApp } from '../context/AppContext'

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="2" width="6" height="6" rx="1.5"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'tarefas',
    label: 'Planejamento',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 5h12M3 9h9M3 13h6"/>
      </svg>
    ),
  },
  {
    id: 'timer',
    label: 'Timer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="10" r="6"/>
        <path d="M9 7v3l2 1.5M7 1h4"/>
      </svg>
    ),
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13L6 9l3.5 3L13 7l3 2"/>
      </svg>
    ),
  },
]

export default function Sidebar({ activePage, onNavigate }) {
  const { settings } = useApp()

  return (
    <aside
      className="w-56 bg-white border-r border-gray-100 flex flex-col px-3 py-6 gap-1 shrink-0"
      role="navigation"
      aria-label="Menu principal"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 pb-6">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M7 2v10M2 7h10"/>
          </svg>
        </div>
        <span className="text-base font-semibold tracking-tight">StudyFlow</span>
      </div>

      {/* Navegação */}
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          aria-current={activePage === item.id ? 'page' : undefined}
          className={`
            flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-150 w-full text-left
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${activePage === item.id
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
          `}
        >
          <span className="opacity-80">{item.icon}</span>
          {item.label}
        </button>
      ))}

      {/* Streak */}
      <div className="mt-auto mx-1 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sequência</p>
        <p className="text-2xl font-semibold text-yellow-500 font-mono leading-none">
          {settings?.streak ?? 0}
        </p>
        <p className="text-xs text-gray-400 mt-1">dias seguidos 🔥</p>
      </div>
    </aside>
  )
}