import { describe, it, expect } from 'vitest'
import { formatMinutes, formatHours, formatTimer } from '../utils/formatTime'

describe('formatMinutes', () => {
  it('retorna 0m para valores inválidos', () => {
    expect(formatMinutes(0)).toBe('0m')
    expect(formatMinutes(null)).toBe('0m')
  })
  it('formata apenas minutos', () => {
    expect(formatMinutes(30)).toBe('30m')
  })
  it('formata horas e minutos', () => {
    expect(formatMinutes(90)).toBe('1h 30m')
  })
  it('formata apenas horas', () => {
    expect(formatMinutes(120)).toBe('2h')
  })
})

describe('formatTimer', () => {
  it('formata segundos em HH:MM:SS', () => {
    expect(formatTimer(0)).toBe('00:00:00')
    expect(formatTimer(65)).toBe('00:01:05')
    expect(formatTimer(3661)).toBe('01:01:01')
  })
})

describe('formatHours', () => {
  it('retorna 0h para valores inválidos', () => {
    expect(formatHours(0)).toBe('0h')
  })
  it('formata horas corretamente', () => {
    expect(formatHours(120)).toBe('2h')
    expect(formatHours(90)).toBe('1.5h')
  })
})