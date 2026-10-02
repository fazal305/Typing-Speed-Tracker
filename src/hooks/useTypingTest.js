import { useCallback, useEffect, useReducer } from 'react'
import { diffInput, scoreKeystrokes } from '../lib/metrics.js'
import { pickPassage } from '../lib/passages.js'

const TICK_MS = 250

function freshState(previousPassage) {
  return {
    passage: pickPassage(previousPassage),
    typed: '',
    keystrokes: 0,
    correctKeystrokes: 0,
    startedAt: null,
    finishedAt: null,
    now: 0,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'input': {
      if (state.finishedAt !== null) return state
      const next = action.value.slice(0, state.passage.length)
      const { start, added } = diffInput(state.typed, next)
      const { correct } = scoreKeystrokes(added, start, state.passage)
      const startedAt = state.startedAt ?? (added.length > 0 ? action.now : null)
      return {
        ...state,
        typed: next,
        keystrokes: state.keystrokes + added.length,
        correctKeystrokes: state.correctKeystrokes + correct,
        startedAt,
        finishedAt: next.length === state.passage.length ? action.now : null,
        now: action.now,
      }
    }
    case 'tick':
      return state.startedAt === null || state.finishedAt !== null
        ? state
        : { ...state, now: action.now }
    case 'reset':
      return freshState(state.passage)
    default:
      return state
  }
}

export function useTypingTest() {
  const [state, dispatch] = useReducer(reducer, undefined, () => freshState())

  const status =
    state.finishedAt !== null ? 'finished' : state.startedAt !== null ? 'running' : 'idle'

  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => dispatch({ type: 'tick', now: performance.now() }), TICK_MS)
    return () => clearInterval(id)
  }, [status])

  const input = useCallback(
    (value) => dispatch({ type: 'input', value, now: performance.now() }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  const elapsedMs =
    state.startedAt === null ? 0 : (state.finishedAt ?? state.now) - state.startedAt

  return { ...state, status, elapsedMs, input, reset }
}
