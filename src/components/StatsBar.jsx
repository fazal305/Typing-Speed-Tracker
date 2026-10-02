import { accuracy, formatSeconds, grossWpm } from '../lib/metrics.js'

export default function StatsBar({ keystrokes, correctKeystrokes, elapsedMs, typedLength, total }) {
  const acc = accuracy(correctKeystrokes, keystrokes)
  const stats = [
    { label: 'WPM', value: grossWpm(keystrokes, elapsedMs), primary: true },
    { label: 'Accuracy', value: acc === null ? '—' : `${acc}%` },
    { label: 'Time', value: formatSeconds(elapsedMs) },
    { label: 'Progress', value: `${typedLength}/${total}` },
  ]

  return (
    <dl className="stats" aria-label="Live results">
      {stats.map((s) => (
        <div key={s.label} className={s.primary ? 'stat stat--primary' : 'stat'}>
          <dt className="stat__label">{s.label}</dt>
          <dd className="stat__value">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}
