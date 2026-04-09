import { supabase } from './supabaseClient'

// Busca as configurações do usuário (sempre linha id=1)
export async function fetchSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) throw error
  return data
}

// Atualiza campos específicos das configurações
export async function updateSettings(fields) {
  const { error } = await supabase
    .from('settings')
    .update(fields)
    .eq('id', 1)
  if (error) throw error
}