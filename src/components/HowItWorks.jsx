export default function HowItWorks() {
  return (
    <section className="explainer" id="how-it-works" aria-labelledby="how-title">
      <h2 id="how-title">How your score is measured</h2>
      <div className="explainer__grid">
        <article>
          <h3>Words per minute</h3>
          <p>
            A “word” is five keystrokes, spaces and punctuation included. Live WPM is every
            character you have typed divided by five, divided by the minutes since your first
            keystroke.
          </p>
          <p className="formula">WPM = (keystrokes ÷ 5) ÷ minutes</p>
          <p>
            Net WPM on the results card counts only the characters that match the passage, so
            mistakes you left in don’t raise your score.
          </p>
        </article>
        <article>
          <h3>Accuracy</h3>
          <p>
            Every character key you press is checked against the passage. Accuracy is the share
            that were right first time. Backspacing fixes the text but not the keystroke, so a
            corrected mistake still counts against you.
          </p>
          <p className="formula">Accuracy = correct keystrokes ÷ total keystrokes</p>
        </article>
        <article>
          <h3>The rules</h3>
          <ul>
            <li>The timer starts on your first keystroke.</li>
            <li>The test ends when you reach the last character.</li>
            <li>Pasting is disabled.</li>
            <li>
              <kbd>Esc</kbd> or the Reset button starts over with a new passage.
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
