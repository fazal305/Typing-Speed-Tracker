import { describe, expect, it } from 'vitest'
import {
  accuracy,
  countCorrectChars,
  diffInput,
  grossWpm,
  netWpm,
  scoreKeystrokes,
} from '../src/lib/metrics.js'
import { PASSAGES, pickPassage } from '../src/lib/passages.js'

describe('diffInput', () => {
  it('detects appended characters', () => {
    expect(diffInput('hel', 'hello')).toEqual({ start: 3, removed: 0, added: 'lo' })
  })

  it('detects backspace', () => {
    expect(diffInput('hello', 'hell')).toEqual({ start: 4, removed: 1, added: '' })
  })

  it('handles a mid-string replacement such as mobile autocorrect', () => {
    expect(diffInput('teh cat', 'the cat')).toEqual({ start: 1, removed: 6, added: 'he cat' })
  })
})

describe('scoreKeystrokes', () => {
  it('scores characters against the target at their position', () => {
    expect(scoreKeystrokes('cxt', 4, 'the cat')).toEqual({ correct: 2, incorrect: 1 })
  })

  it('treats characters beyond the target as incorrect', () => {
    expect(scoreKeystrokes('ab', 2, 'ab')).toEqual({ correct: 0, incorrect: 2 })
  })
})

describe('countCorrectChars', () => {
  it('counts positional matches only', () => {
    expect(countCorrectChars('thx cat', 'the cat')).toBe(6)
  })
})

describe('grossWpm (FR-2.1)', () => {
  it('is keystrokes / 5 per minute', () => {
    expect(grossWpm(300, 60000)).toBe(60)
    expect(grossWpm(150, 30000)).toBe(60)
  })

  it('is zero before any keystroke', () => {
    expect(grossWpm(0, 5000)).toBe(0)
  })

  it('clamps elapsed time to one second to avoid spikes', () => {
    expect(grossWpm(1, 10)).toBe(12)
  })
})

describe('netWpm', () => {
  it('counts only correct characters', () => {
    expect(netWpm(250, 60000)).toBe(50)
  })
})

describe('accuracy (FR-2.2)', () => {
  it('is correct keystrokes over total keystrokes', () => {
    expect(accuracy(95, 100)).toBe(95)
    expect(accuracy(2, 3)).toBe(66.7)
  })

  it('is null before any keystroke', () => {
    expect(accuracy(0, 0)).toBeNull()
  })
})

describe('passages', () => {
  it('are plain printable ASCII so every character is typeable', () => {
    for (const p of PASSAGES) expect(p).toMatch(/^[\x20-\x7E]+$/)
  })

  it('never repeats the excluded passage', () => {
    for (let i = 0; i < 50; i++) expect(pickPassage(PASSAGES[0])).not.toBe(PASSAGES[0])
  })
})
