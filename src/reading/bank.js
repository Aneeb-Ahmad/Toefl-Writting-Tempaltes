// Reading question bank: the official ETS practice tests, imported locally by scripts/import-ets-reading.mjs
// (runs automatically before `npm run dev` and `npm run build`).
import { getDone } from '../storage'

const sets = Object.values(import.meta.glob('./data/*.local.json', { eager: true, import: 'default' })).flatMap(
  (file) => file.sets ?? [],
)

export const getAllSets = () => sets
export const itemCount = (set) => (set.type === 'ctw' ? set.answers.length : set.questions.length)

// A module follows the official ETS practice tests: one Complete the Words paragraph (10 items), a 2-question
// and a 3-question Read in Daily Life set, and one Read an Academic Passage (5 items) — 20 items.
const SLOTS = [
  { type: 'ctw' },
  { type: 'daily', size: 2 },
  { type: 'daily', size: 3 },
  { type: 'academic' },
]

function pick(done, used, slot) {
  const fits = sets.filter((s) => s.type === slot.type && !used.has(s.id))
  if (!fits.length) return null
  const rank = (s) =>
    (done.includes(s.id) ? 2 : 0) + // prefer sets you have not practiced
    (slot.size && s.questions.length !== slot.size ? 1 : 0)
  const best = Math.min(...fits.map(rank))
  const choices = fits.filter((s) => rank(s) === best)
  return choices[Math.floor(Math.random() * choices.length)]
}

export function buildModule(usedIds = []) {
  const done = getDone('reading')
  const used = new Set(usedIds)
  const chosen = []
  for (const slot of SLOTS) {
    const s = pick(done, used, slot)
    if (s) {
      chosen.push(s)
      used.add(s.id)
    }
  }
  return { sets: chosen, items: chosen.reduce((n, s) => n + itemCount(s), 0) }
}

// Two-stage design (ETS 2026 blueprint): Module 1 routes you to an easier or a harder Module 2.
// ETS does not publish the cut-off; this app routes at 60% of Module 1 correct.
export const ROUTE_THRESHOLD = 0.6
export const routeFor = (correct, total) => (total && correct / total >= ROUTE_THRESHOLD ? 'upper' : 'lower')

export function bankSummary() {
  const count = (t) => sets.filter((s) => s.type === t).length
  return { ctw: count('ctw'), daily: count('daily'), academic: count('academic') }
}
