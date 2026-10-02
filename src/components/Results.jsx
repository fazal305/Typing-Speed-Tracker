import { accuracy, countCorrectChars, formatSeconds, grossWpm, netWpm } from '../lib/metrics.js'

export default function Results({ passage, typed, keystrokes, correctKeystrokes, elapsedMs, onReset, buttonRef }) {
  const correctChars = countCorrectChars(typed, passage)
  const gross = grossWpm(keystrokes, elapsedMs)
  const net = netWpm(correctChars, elapsedMs)
  const acc = accuracy(correctKeystrokes, keystrokes) ?? 0
  const uncorrected = passage.length - correctChars

  const rows = [
    { label: 'Gross WPM', value: gross, note: 'all keystrokes' },
    { label: 'Net WPM', value: net, note: 'correct characters only' },
    { label: 'Accuracy', value: `${acc}%`, note: `${correctKeystrokes} of ${keystrokes} keystrokes` },
    { label: 'Time', value: formatSeconds(elapsedMs), note: `${passage.length} characters` },
  ]

  return (
    <section className="results" aria-labelledby="results-title">
      <h2 id="results-title" className="results__title">
        Passage complete
      </h2>
      <p className="results__summary" role="status">
        {gross} words per minute at {acc}% accuracy
        {uncorrected > 0 && `, with ${uncorrected} uncorrected ${uncorrected === 1 ? 'error' : 'errors'}`}.
      </p>
      <dl className="results__grid">
        {rows.map((r) => (
          <div key={r.label} className="results__item">
            <dt>{r.label}</dt>
            <dd>
              <span className="results__value">{r.value}</span>
              <span className="results__note">{r.note}</span>
            </dd>
          </div>
        ))}
      </dl>
      <button ref={buttonRef} type="button" className="button button--primary" onClick={onReset}>
        Try another passage
      </button>
    </section>
  )
}
