import { memo, useEffect, useMemo, useRef, useState } from 'react'

const Char = memo(function Char({ ch, state, current }) {
  let className = `char char--${state}`
  if (ch === ' ') className += ' char--space'
  if (current) className += ' char--current'
  return <span className={className}>{ch}</span>
})

// Spaces sit between the nowrap word spans so lines can break there.
function splitTokens(passage) {
  const tokens = []
  let word = []
  for (let i = 0; i < passage.length; i++) {
    if (passage[i] === ' ') {
      if (word.length) tokens.push(word)
      tokens.push([{ ch: ' ', i }])
      word = []
    } else {
      word.push({ ch: passage[i], i })
    }
  }
  if (word.length) tokens.push(word)
  return tokens
}

const BLOCKED_KEYS = new Set(['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'])

function Passage({ passage, typed, finished, onInput, inputRef }) {
  const tokens = useMemo(() => splitTokens(passage), [passage])
  const composing = useRef(false)
  const textRef = useRef(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const el = inputRef.current
    if (el && el.value !== typed) el.value = typed
  }, [typed, inputRef])

  useEffect(() => {
    const caret = textRef.current?.querySelector('.char--current')
    if (!caret) return
    const rect = caret.getBoundingClientRect()
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    if (rect.top < 0 || rect.bottom > viewportHeight) caret.scrollIntoView({ block: 'center' })
  }, [typed])

  const handleInput = (e) => {
    if (composing.current) return
    onInput(e.target.value)
  }

  const keepCaretAtEnd = (e) => {
    const el = e.target
    const end = el.value.length
    if (el.selectionStart !== end || el.selectionEnd !== end) el.setSelectionRange(end, end)
  }

  return (
    <div className={`passage${focused ? ' passage--focused' : ''}${finished ? ' passage--finished' : ''}`}>
      <p ref={textRef} className="passage__text" id="passage-text" aria-hidden="true">
        {tokens.map((token) => {
          const chars = token.map(({ ch, i }) => (
            <Char
              key={i}
              ch={ch}
              state={i >= typed.length ? 'pending' : typed[i] === ch ? 'correct' : 'incorrect'}
              current={!finished && i === typed.length}
            />
          ))
          return token[0].ch === ' ' ? (
            chars
          ) : (
            <span key={token[0].i} className="word">
              {chars}
            </span>
          )
        })}
      </p>
      <p className="visually-hidden" id="passage-plain">{passage}</p>
      <label htmlFor="typing-input" className="visually-hidden">
        Type the passage
      </label>
      <textarea
        id="typing-input"
        ref={inputRef}
        className="passage__input"
        aria-describedby="passage-plain"
        maxLength={passage.length}
        readOnly={finished}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onInput={handleInput}
        onCompositionStart={() => (composing.current = true)}
        onCompositionEnd={(e) => {
          composing.current = false
          onInput(e.target.value)
        }}
        onKeyDown={(e) => BLOCKED_KEYS.has(e.key) && e.preventDefault()}
        onSelect={keepCaretAtEnd}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {!focused && !finished && (
        <p className="passage__hint" aria-hidden="true">
          {typed.length ? 'Click or tap here to keep typing' : 'Click or tap here, then start typing'}
        </p>
      )}
    </div>
  )
}

export default memo(Passage)
