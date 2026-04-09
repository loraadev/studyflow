import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TaskPlanner from './components/TaskPlanner'
import StudyTimer from './components/StudyTimer'
import Reports from './components/Reports'

const PAGES = {
  dashboard: Dashboard,
  tarefas: TaskPlanner,
  timer: StudyTimer,
  relatorios: Reports,
}

function AppShell() {
  const [page, setPage] = useState('dashboard')
  const PageComponent = PAGES[page]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar activePage={page} onNavigate={setPage} />
      <PageComponent />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
