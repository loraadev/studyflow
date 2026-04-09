import { supabase } from './supabaseClient'
import { todayKey, daysAgo } from '../utils/dateHelpers'

// Busca todas as sessões
export async function fetchSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Busca sessões dos últimos N dias
export async function fetchSessionsLastDays(n = 7) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .gte('studied_at', daysAgo(n - 1))
    .order('studied_at', { ascending: true })
  if (error) throw error
  return data
}

// Registra uma nova sessão de estudo
export async function createSession({ subject, duration_minutes }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ subject, duration_minutes, studied_at: todayKey() }])
    .select()
    .single()
  if (error) throw error
  return data
}