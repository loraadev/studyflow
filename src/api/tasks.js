import { supabase } from './supabaseClient'

// Busca todas as tarefas ordenadas por prioridade e data
export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

// Cria uma nova tarefa
export async function createTask({ name, duration_minutes, priority }) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ name, duration_minutes, priority }])
    .select()
    .single()
  if (error) throw error
  return data
}

// Atualiza o campo "done" de uma tarefa
export async function toggleTask(id, done) {
  const { error } = await supabase
    .from('tasks')
    .update({ done })
    .eq('id', id)
  if (error) throw error
}

// Remove uma tarefa
export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  if (error) throw error
}