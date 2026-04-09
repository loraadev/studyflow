import { useState, useRef, useCallback } from 'react'

const POMODORO_FOCUS = 25 * 60   // 25 minutos em segundos
const POMODORO_BREAK = 5 * 60    // 5 minutos em segundos

export function useTimer() {
  const [seconds, setSeconds]     = useState(0)
  const [running, setRunning]     = useState(false)
  const [paused, setPaused]       = useState(false)
  const [phase, setPhase]         = useState('focus') // 'focus' | 'break'
  const [cycle, setCycle]         = useState(0)
  const intervalRef               = useRef(null)
  const startTimeRef              = useRef(null)
  const accumulatedRef            = useRef(0)

  const start = useCallback(() => {
    if (running && !paused) return
    startTimeRef.current = Date.now()
    setRunning(true)
    setPaused(false)
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setSeconds(accumulatedRef.current + elapsed)
    }, 500)
  }, [running, paused])

  const pause = useCallback(() => {
    if (!running || paused) return
    clearInterval(intervalRef.current)
    accumulatedRef.current = seconds
    setPaused(true)
  }, [running, paused, seconds])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    const finalSeconds = seconds
    setSeconds(0)
    setRunning(false)
    setPaused(false)
    setPhase('focus')
    setCycle(0)
    accumulatedRef.current = 0
    return Math.max(1, Math.round(finalSeconds / 60)) // retorna minutos
  }, [seconds])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setSeconds(0)
    setRunning(false)
    setPaused(false)
    setPhase('focus')
    setCycle(0)
    accumulatedRef.current = 0
  }, [])

  // Lógica do Pomodoro
  const checkPomodoro = useCallback(() => {
    const phaseDuration = phase === 'focus' ? POMODORO_FOCUS : POMODORO_BREAK
    const phaseStart = cycle * (POMODORO_FOCUS + POMODORO_BREAK) +
      (phase === 'break' ? POMODORO_FOCUS : 0)

    if (seconds - phaseStart >= phaseDuration) {
      if (phase === 'focus') {
        setPhase('break')
      } else {
        setPhase('focus')
        setCycle(c => c + 1)
      }
    }
  }, [seconds, phase, cycle])

  return {
    seconds, running, paused,
    phase, cycle,
    start, pause, stop, reset,
    checkPomodoro,
    POMODORO_FOCUS, POMODORO_BREAK,
  }
}