import { describe, it, expect } from 'vitest'

// Testa funções puras relacionadas a tarefas
describe('lógica de tarefas', () => {
  it('ordena tarefas por prioridade corretamente', () => {
    const prioOrder = { high: 0, med: 1, low: 2 }
    const tasks = [
      { id: 1, name: 'Matemática', priority: 'low' },
      { id: 2, name: 'Física', priority: 'high' },
      { id: 3, name: 'História', priority: 'med' },
    ]
    const sorted = [...tasks].sort(
      (a, b) => prioOrder[a.priority] - prioOrder[b.priority]
    )
    expect(sorted[0].name).toBe('Física')
    expect(sorted[1].name).toBe('História')
    expect(sorted[2].name).toBe('Matemática')
  })

  it('filtra apenas tarefas não concluídas', () => {
    const tasks = [
      { id: 1, name: 'Matemática', done: false },
      { id: 2, name: 'Física', done: true },
      { id: 3, name: 'História', done: false },
    ]
    const pending = tasks.filter(t => !t.done)
    expect(pending).toHaveLength(2)
    expect(pending.every(t => !t.done)).toBe(true)
  })

  it('conta tarefas concluídas corretamente', () => {
    const tasks = [
      { id: 1, done: true },
      { id: 2, done: false },
      { id: 3, done: true },
    ]
    const doneCount = tasks.filter(t => t.done).length
    expect(doneCount).toBe(2)
  })
})