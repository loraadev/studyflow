import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchTasks, createTask, toggleTask, deleteTask } from '../api/tasks'
import { fetchSessions, createSession, fetchSessionsLastDays } from '../api/sessions'
import { fetchSettings, updateSettings } from '../api/settings'
import { todayKey } from '../utils/dateHelpers'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [tasks, setTasks]       = useState([])
  const [sessions, setSessions] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // Carrega todos os dados do Supabase ao iniciar
  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [t, s, cfg] = await Promise.all([
        fetchTasks(),
        fetchSessionsLastDays(30),
        fetchSettings(),
      ])
      setTasks(t)
      setSessions(s)
      setSettings(cfg)
    } catch (err) {
      setError('Erro ao carregar dados. Verifique sua conexão.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // --- TAREFAS ---
  const addTask = useCallback(async (taskData) => {
    const newTask = await createTask(taskData)
    setTasks(prev => [...prev, newTask])
  }, [])

  const checkTask = useCallback(async (id, done) => {
    await toggleTask(id, done)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done } : t))
  }, [])

  const removeTask = useCallback(async (id) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  // --- SESSÕES ---
  const addSession = useCallback(async (sessionData) => {
    const newSession = await createSession(sessionData)
    setSessions(prev => [newSession, ...prev])

    // Atualiza streak
    const today = todayKey()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = yesterday.toISOString().slice(0, 10)

    const alreadyStudiedToday = sessions.some(s => s.studied_at === today)
    if (!alreadyStudiedToday) {
      const newStreak = settings?.last_study_day === yesterdayKey
        ? (settings.streak || 0) + 1
        : 1
      const updated = { streak: newStreak, last_study_day: today }
      await updateSettings(updated)
      setSettings(prev => ({ ...prev, ...updated }))
    }
  }, [sessions, settings])

  // --- CONFIGURAÇÕES ---
  const saveSettings = useCallback(async (fields) => {
    await updateSettings(fields)
    setSettings(prev => ({ ...prev, ...fields }))
  }, [])

  return (
    <AppContext.Provider value={{
      tasks, sessions, settings,
      loading, error,
      addTask, checkTask, removeTask,
      addSession, saveSettings,
      reload: loadAll,
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook para usar o contexto facilmente
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}