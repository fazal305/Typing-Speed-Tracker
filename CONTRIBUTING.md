# Contributing

Thanks for your interest in improving Speed Type.

## Setup

```bash
npm install
npm run dev
```

## Before you open a pull request

1. Keep changes focused. One fix or feature per pull request.
2. Run `npm test`, `npm run lint` and `npm run build`. All three must pass.
3. If you change how scores are calculated, update the unit tests in `tests/` and the "How your score is measured" section.
4. Check the layout at 375 px wide and in dark mode, and make sure everything works with the keyboard alone.
5. Don't add a runtime dependency unless a requirement needs it. Explain why in the pull request.

## Passages

New passages must be original writing, not copied from books or articles. They must use plain printable ASCII (no curly quotes or em dashes) and be about 30 to 45 words long. The unit tests enforce the ASCII rule.

## Reporting bugs

Open an issue using the bug report template. Include your browser, your device and the steps to reproduce.
