# Typing Speed Tracker — Plan

## 1. Context (understanding of the SRS)

- A client-only typing test: show a passage, the user types it, the app scores the attempt.
- The passage is chosen at random from a bundled set (FR-1.1). There is no server and no database (SRS 1.2, 2.1).
- Input is captured once the user starts typing in the input field (FR-1.2). Each character is marked correct or incorrect as it is typed (FR-1.3).
- WPM is recalculated continuously from keystrokes and elapsed time (FR-2.1).
- Accuracy is a running percentage: correct keystrokes divided by total keystrokes (FR-2.2).
- A prominent Reset control clears the timer, the counters and the field, then loads a new passage (FR-3.1, FR-3.2).
- Each keystroke must be checked and the metrics updated in under 50 ms (NFR-4.1).
- The layout must be responsive and work with touch on phones, tablets and desktops (NFR-5.1), with no degradation in Chrome, Safari, Edge or Firefox (NFR-5.2).

### Ambiguities and contradictions

| # | Issue | Decision |
|---|---|---|
| A1 | NFR-4.2 and SRS §5 require vanilla JS with no frameworks. The owner asked for React and vanilla CSS. | **React 19 + Vite, vanilla CSS.** This deliberately deviates from NFR-4.2 at the owner's request. Production runtime dependencies are limited to React and the self-hosted fonts. |
| A2 | FR-2.1 bases WPM on *total keystrokes*. That is gross WPM, which does not penalise errors. | The live WPM is gross WPM, as the SRS specifies: (typed chars / 5) / minutes. The final summary also shows net WPM (correct chars / 5 / minutes) so the result can't be inflated by mistakes. |
| A3 | FR-2.2 says "total keyboard presses" without saying whether Backspace counts. | Only character-producing keystrokes count. Backspace and modifier keys don't. Mistakes that were corrected still lower accuracy, because accuracy measures keystrokes, not the final text. |
| A4 | The SRS never says when a test ends. | A test ends when the typed text reaches the passage length. There is no countdown mode, because the SRS doesn't ask for one. |
| A5 | "Random or pre-defined text" | A random pick from about a dozen original passages (plain ASCII, no copyrighted text). The next pick never repeats the current passage. A text API would add a network dependency to a client-only app. |
| A6 | The name says "Tracker", but the SRS has no history or persistence requirement. | Results are not stored. The app tracks metrics in real time only, as SRS §1.1 describes. |
| A7 | NFR-5.2 requires all four browsers. | Only Chromium is available in the build environment. The other three use standard APIs only (`input`, `beforeinput`, composition events) and are listed as untested. |

## 2. Proposal

### Folder structure

```
index.html                 metadata, fonts preload, root
public/                    favicon.svg, og-image.png, robots.txt, sitemap.xml, 404.html
src/
  main.jsx                 mount
  App.jsx                  layout, test lifecycle
  styles/                  tokens.css, base.css, app.css (vanilla CSS)
  lib/metrics.js           pure: keystroke diffing, WPM, accuracy (unit-tested)
  lib/passages.js          bundled passages + random picker
  hooks/useTypingTest.js   state machine: idle → running → finished
  components/
    StatsBar.jsx           live WPM / accuracy / time / progress
    Passage.jsx            per-character rendering + caret + hidden input
    Results.jsx            final summary (announced via aria-live)
    HowItWorks.jsx         formulas explained (educational purpose, SRS 1.1)
  pages/Privacy.jsx        short privacy statement (no data collected)
tests/                     vitest unit tests for lib/
```

### Data flow

The `<textarea>` `input` event passes the old and new values to `diffInput()` in `lib/metrics.js`. That returns the keystrokes added and removed. A `useReducer` updates the counters and the typed string. `Passage` re-renders only the characters whose state changed (a memoized per-character component), and `StatsBar` reads the derived metrics. While the test is running, a 250 ms interval ticks the clock so WPM keeps updating between keystrokes.

### Data model

There isn't one. Nothing is persisted: no tables, no localStorage, no cookies.

### Checklist: applies / skipped

| Item | Decision |
|---|---|
| UI states: empty, idle, running, finished | **Apply.** "Idle" is the empty state, with a prompt to start typing. |
| Loading skeletons, slow network, no internet | Skip. All content is bundled, so there's nothing to fetch after load. |
| Search, permission denied, session expired | Skip. There's no search and no auth. |
| Form validation | Skip. The only input is the typing field, so there's no form. |
| AI / LLM features | Skip. None in the SRS. |
| Rate limiting, RLS, server validation, uploads, payments, CORS | Skip. There's no backend. |
| Security headers (CSP, nosniff, Referrer-Policy, frame-ancestors) | **Apply** via `vercel.json`. |
| Output escaping | **Apply.** React escapes by default, and `dangerouslySetInnerHTML` is never used. |
| Privacy Policy | **Apply** (short). It states that nothing is collected. |
| Terms, Cookie Policy, cookie banner, Refund Policy | Skip. No cookies, accounts or payments. |
| Analytics | Skip. Nothing is tracked. |
| FAQ | Covered by the "How it's measured" section. |
| Custom 404 | **Apply.** |
| SEO metadata, canonical, OG/Twitter, favicon, robots, sitemap, real screenshot | **Apply.** |
| Lighthouse, 375 px overflow check, keyboard and focus, reduced motion | **Apply.** |
| Three.js, Lenis, Barba.js, Motion Primitives, Aceternity, Haikei, Stitch | Skip. A typing test needs focus and low latency, not decoration, and Barba and Lenis don't fit a single view. |
| UI/UX skill repos, Strix scan | Evaluated. Strix needs a running backend attack surface, and this static app has none. |
| Public APIs | Skip (see A5). |

### Build order

1. **M1 – Engine.** `lib/metrics.js` and `lib/passages.js`, with unit tests (FR-2.1, FR-2.2).
2. **M2 – Typing UI.** Passage rendering, the input, and live stats (FR-1.1 to FR-1.3, NFR-4.1).
3. **M3 – Reset and results.** Reset button, Escape shortcut, end-of-test summary (FR-3.1, FR-3.2).
4. **M4 – Responsive and accessibility polish.** NFR-5.1: 375 px checks, focus, reduced motion.
5. **M5 – Production.** Metadata, 404, privacy, security headers, README, repo hygiene files, Lighthouse.

## 3. Visual system

- **Aesthetic:** a printed manuscript. Warm paper, dark ink and a single vermilion accent, closer to a literary journal than a terminal.
- **Layout:** one centred column (max 52 rem). The hierarchy runs from the live stats (large numerals), to the passage (the largest text block, and the focus of the page), to the Reset button, to an explanation of how scores are measured.
- **Typography:** Fraunces (variable serif, optical sizing) for the passage, headings and numerals, with tabular figures so the stats don't jitter. Instrument Sans for labels and buttons. Both are self-hosted.
- **Colour (light):** paper `#F5F0E6`, surface `#FBF8F2`, ink `#1E1A16`, secondary `#5C5348`, untyped text `#7D7366`, error `#B42318` (with a tinted background and an underline, so errors aren't signalled by colour alone), and accent `#B93C0B`.
  - The dark theme uses its own values, following `prefers-color-scheme`.
  - Every text pair is checked against WCAG AA.
- **Spacing:** airy, on a 4 px base scale.
- **Components:** flat, with 1 px hairline borders, a 8 px radius and no drop shadows. The focus ring is a 2 px accent outline with an offset.
- **Motion:** only the caret blinks, and it stops blinking under `prefers-reduced-motion`.
