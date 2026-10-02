export const CHARS_PER_WORD = 5

// Short tests would otherwise report absurd WPM after the first keystroke.
const MIN_ELAPSED_MS = 1000

export function diffInput(prev, next) {
  const max = Math.min(prev.length, next.length)
  let prefix = 0
  while (prefix < max && prev[prefix] === next[prefix]) prefix++
  return { start: prefix, removed: prev.length - prefix, added: next.slice(prefix) }
}

export function scoreKeystrokes(added, start, target) {
  let correct = 0
  for (let i = 0; i < added.length; i++) {
    if (added[i] === target[start + i]) correct++
  }
  return { correct, incorrect: added.length - correct }
}

export function countCorrectChars(typed, target) {
  let n = 0
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) n++
  return n
}

function minutes(elapsedMs) {
  return Math.max(elapsedMs, MIN_ELAPSED_MS) / 60000
}

export function grossWpm(keystrokes, elapsedMs) {
  if (keystrokes === 0) return 0
  return Math.round(keystrokes / CHARS_PER_WORD / minutes(elapsedMs))
}

export function netWpm(correctChars, elapsedMs) {
  if (correctChars === 0) return 0
  return Math.round(correctChars / CHARS_PER_WORD / minutes(elapsedMs))
}

export function formatSeconds(ms) {
  return `${(ms / 1000).toFixed(1)}s`
}

export function accuracy(correctKeystrokes, totalKeystrokes) {
  if (totalKeystrokes === 0) return null
  return Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10
}
