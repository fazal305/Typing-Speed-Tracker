export const PASSAGES = [
  'The river had been low all summer, so the children walked along its stony bed and found things the water had kept for years: a bicycle bell, a blue bottle, and a key that opened nothing they could find.',
  'Good habits are built the way paths are worn into grass. Nobody plans the path. People simply keep choosing the same short way across the field until the ground remembers it for them.',
  'A lighthouse keeper once wrote that the hardest part of the job was not the storms. It was the calm nights, when the light turned for hours over empty water and nothing at all needed saving.',
  'When you learn to type without looking, your hands stop being a tool you watch and become a quiet part of thinking. The words arrive on the screen at nearly the speed they arrive in your head.',
  'Bread asks for patience more than skill. Mix flour, water, salt, and yeast, then leave it alone. The work happens in the waiting, while the dough slowly rises under a cloth on the kitchen table.',
  'The old map showed a town that was no longer there. Its streets were drawn in careful ink, with a bakery, a school, and a square, but the hill where it stood was now covered in pine trees.',
  'Most bugs are not clever. They hide in the line you were sure about, the one you read past three times because it looked fine. Reading slowly, out loud, finds more errors than reading quickly.',
  'At dawn the market fills with noise. Crates of oranges are stacked into bright walls, fishmongers shout prices over the ice, and somebody always drops a box of eggs before the sun is fully up.',
  'A good question is often more useful than a quick answer. It slows the conversation down, points everyone at the real problem, and leaves room for an idea that nobody in the room had before.',
  'The night train left the city at ten. By midnight the lights outside had thinned to a few farm windows, and the only sound was the steady rhythm of the wheels and a radio playing softly two seats away.',
  'Practice works best in short, focused sessions. Ten careful minutes a day will improve your typing more than one long hour each weekend, because accuracy built slowly turns into speed on its own.',
  'Every winter the lake froze from the edges inward. For a week it groaned and cracked at night, and then one morning it was silent, white, and solid enough for the whole village to walk across.',
]

export function pickPassage(exclude) {
  const pool = PASSAGES.filter((p) => p !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}
