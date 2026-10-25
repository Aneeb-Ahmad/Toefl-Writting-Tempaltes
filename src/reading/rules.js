// Scoring rules for the Reading section (TOEFL iBT, tests from January 21, 2026). Every rule cites its ETS source.
import { parseCtw, sameLetters } from './ctw'

// ETS 2026 Test Blueprint: "Max points per item is 1 for scored items in the Reading section."
// Items are machine scored by exact match — Complete the Words blanks one point each, multiple choice one point each.

// ETS "Score scale update" (2026), Table 6 (Reading 0–30 ↔ band) and Table 7 (band ↔ CEFR).
export const READING_BANDS = [
  { band: 6, min: 29, max: 30, cefr: 'C2' },
  { band: 5.5, min: 27, max: 28, cefr: 'C1' },
  { band: 5, min: 24, max: 26, cefr: 'C1' },
  { band: 4.5, min: 22, max: 23, cefr: 'B2' },
  { band: 4, min: 18, max: 21, cefr: 'B2' },
  { band: 3.5, min: 12, max: 17, cefr: 'B1' },
  { band: 3, min: 6, max: 11, cefr: 'B1' },
  { band: 2.5, min: 4, max: 5, cefr: 'A2' },
  { band: 2, min: 3, max: 3, cefr: 'A2' },
  { band: 1.5, min: 2, max: 2, cefr: 'A1' },
  { band: 1, min: 0, max: 1, cefr: 'A1' },
]

export const TASK_NAMES = { ctw: 'Complete the Words', daily: 'Read in Daily Life', academic: 'Read an Academic Passage' }

// Question skills as ETS lists them for each task (Test Overview, 2026). Classified from the question wording.
export function skillOf(set, q) {
  const p = q.prompt
  if (q.insertSentence) return 'Insert a sentence'
  if (/closest in meaning/i.test(p)) return 'Vocabulary in context'
  if (/\bNOT\b|\bEXCEPT\b/.test(p)) return 'Negative factual information'
  if (/infer|impl(y|ied)|suggest|most likely/i.test(p)) return 'Inference'
  if (/why does the (author|writer)|purpose of (paragraph|the paragraph)/i.test(p)) return 'Rhetorical purpose'
  if (/main (purpose|idea)|what is the .* about\??$/i.test(p)) return 'Main idea / purpose'
  return set.type === 'daily' ? 'Key detail (scan)' : 'Factual information'
}

// Flattens a module into scorable items with the test taker's answers.
export function moduleItems(module, responses) {
  const items = []
  for (const set of module.sets) {
    if (set.type === 'ctw') {
      const { segments } = parseCtw(set.paragraph, set.answers)
      for (const seg of segments) {
        if (seg.type !== 'blank') continue
        const given = responses[`${set.id}:b${seg.index}`] ?? ''
        items.push({ set, kind: 'blank', skill: 'Complete the Words', stem: seg.stem, answer: seg.answer, given, correct: sameLetters(given, seg.answer) })
      }
    } else {
      set.questions.forEach((q, qi) => {
        const given = responses[`${set.id}:q${qi}`]
        items.push({ set, kind: 'mc', q, skill: skillOf(set, q), answer: q.answer, given, correct: given === q.answer })
      })
    }
  }
  return items
}

function tally(items, keyOf) {
  const map = new Map()
  for (const it of items) {
    const k = keyOf(it)
    const row = map.get(k) || { name: k, correct: 0, total: 0 }
    row.total++
    if (it.correct) row.correct++
    map.set(k, row)
  }
  return [...map.values()]
}

export function bandFor30(score30) {
  return READING_BANDS.find((r) => score30 >= r.min && score30 <= r.max) || READING_BANDS[READING_BANDS.length - 1]
}

// ETS converts raw points with IRT equating that is not published; without a backend the closest honest
// estimate is the share of points earned scaled onto the 0–30 Reading scale, then read off Table 6.
export function scoreReading(modules, responses) {
  const perModule = modules.map((m) => moduleItems(m, responses))
  const items = perModule.flat()
  const correct = items.filter((i) => i.correct).length
  const score30 = items.length ? Math.round((correct / items.length) * 30) : 0
  const row = bandFor30(score30)
  return {
    items,
    perModule: perModule.map((list) => ({ correct: list.filter((i) => i.correct).length, total: list.length })),
    correct,
    total: items.length,
    score30,
    band: row.band,
    cefr: row.cefr,
    byTask: tally(items, (i) => TASK_NAMES[i.set.type]),
    bySkill: tally(items, (i) => i.skill),
  }
}
