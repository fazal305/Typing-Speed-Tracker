import { useCallback, useEffect, useRef } from 'react'
import HowItWorks from './components/HowItWorks.jsx'
import Passage from './components/Passage.jsx'
import Results from './components/Results.jsx'
import StatsBar from './components/StatsBar.jsx'
import { useTypingTest } from './hooks/useTypingTest.js'

export default function App() {
  const test = useTypingTest()
  const { status, reset } = test
  const inputRef = useRef(null)
  const resultsButtonRef = useRef(null)
  const finished = status === 'finished'

  const handleReset = useCallback(() => {
    reset()
    inputRef.current?.focus()
  }, [reset])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (finished) resultsButtonRef.current?.focus()
  }, [finished])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleReset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleReset])

  return (
    <>
      <a className="skip-link" href="#typing-input">
        Skip to the typing test
      </a>
      <header className="site-header">
        <a className="wordmark" href="/">
          Speed<em>Type</em>
        </a>
        <nav aria-label="Primary">
          <a href="#how-it-works">How it’s measured</a>
        </nav>
      </header>

      <main className="container">
        <section className="test" aria-labelledby="test-title">
          <h1 id="test-title">How fast do you type?</h1>

          <StatsBar
            keystrokes={test.keystrokes}
            correctKeystrokes={test.correctKeystrokes}
            elapsedMs={test.elapsedMs}
            typedLength={test.typed.length}
            total={test.passage.length}
          />

          <div className="toolbar">
            <p className="lede">
              {status === 'idle'
                ? 'Type the passage below. The clock starts on your first keystroke.'
                : status === 'running'
                  ? 'Keep going. Mistakes are marked in red as you type.'
                  : 'Done. Here’s how it went.'}
            </p>
            <div className="controls">
              <button type="button" className="button button--reset" onClick={handleReset}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Reset
              </button>
              <span className="controls__hint">
                or press <kbd>Esc</kbd>
              </span>
            </div>
          </div>

          <Passage
            passage={test.passage}
            typed={test.typed}
            finished={finished}
            onInput={test.input}
            inputRef={inputRef}
          />

          {finished && (
            <Results
              passage={test.passage}
              typed={test.typed}
              keystrokes={test.keystrokes}
              correctKeystrokes={test.correctKeystrokes}
              elapsedMs={test.elapsedMs}
              onReset={handleReset}
              buttonRef={resultsButtonRef}
            />
          )}
        </section>

        <HowItWorks />
      </main>

      <footer className="site-footer">
        <p>Runs entirely in your browser. Nothing you type leaves this page.</p>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="https://github.com/fazal305/typing-speed-tracker">Source on GitHub</a>
        </nav>
      </footer>
    </>
  )
}
