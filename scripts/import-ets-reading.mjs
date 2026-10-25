// Imports the Reading sections of the official ETS "TOEFL iBT Teacher Resources" practice tests
// (2026 format) into the app's question bank.
//
//   npm run import:ets               use the PDFs already in ./ets-pdfs
//   npm run import:ets -- --download first download them from ets.org into ./ets-pdfs
//   --auto                           what `npm run dev` / `npm run build` use: do nothing if the question bank
//                                    already exists, otherwise download + import; never fails the start-up
//
// The output (src/reading/data/ets-practice.local.json) and the PDFs are gitignored: ETS material is
// copyrighted, so it stays on this computer and is never pushed to GitHub.
// Needs the `pdftotext` command (Poppler). Git for Windows ships it in <Git>\mingw64\bin.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCtw } from '../src/reading/ctw.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PDF_DIR = join(ROOT, 'ets-pdfs')
const OUT_FILE = join(ROOT, 'src', 'reading', 'data', 'ets-practice.local.json')

const OFFICIAL_TESTS = [
  {
    tag: 'pt1',
    name: 'ETS TOEFL iBT Teacher Resources — Practice Test 1',
    url: 'https://www.cn.ets.org/pdfs/toefl/toefl-ibt-teachers-resources-practice-test-1.pdf',
  },
  {
    tag: 'pt2',
    name: 'ETS TOEFL iBT Teacher Resources — Practice Test 2',
    url: 'https://www.eu.ets.org/pdfs/toefl/toefl-ibt-teachers-resources-practice-test-2.pdf',
  },
  ...[3, 4, 5].map((n) => ({
    tag: `pt${n}`,
    name: `ETS TOEFL iBT Teacher Resources — Practice Test ${n}`,
    url: `https://www.ets.org/pdfs/toefl/toefl-ibt-teachers-resources-practice-test-${n}.pdf`,
  })),
]

const fileOf = (test) => join(PDF_DIR, test.url.split('/').pop())

async function download(test) {
  const res = await fetch(test.url)
  if (!res.ok) throw new Error(`${test.url} → HTTP ${res.status}`)
  writeFileSync(fileOf(test), Buffer.from(await res.arrayBuffer()))
  console.log(`Downloaded ${test.url}`)
}

function pdfText(file) {
  try {
    return execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', file, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('pdftotext was not found. Install Poppler, or run this from Git Bash (Git for Windows includes it).')
    }
    throw err
  }
}

// ---------- text helpers ----------

// Tests 1–2 and tests 3–5 use slightly different page layouts; both are handled.
const FOOTER_RE = /TOEFL iBT\S*\s+(?:Teacher Resources\s+\S+\s+)?Practice Test \d+\s+\d+\s*$/
const MODULE_RE = /^\s*Reading Section, Module (\d)\s*$/
const KEY_RE = /Question\s+Reading Section, Module (\d)/
// Multiple-choice questions are always numbered 11–20 (1–10 are the Complete the Words blanks), so a
// numbered list inside a notice ("1. Noise Levels: …") is not mistaken for a question.
const QUESTION_RE = /^\s*(1[1-9]|20)\.\s+(.*)$/
const OPTION_RE = /^\s*\(([A-D])\)\s*(.*)$/
const READ_RE = /^\s*Read (?:a|an) (.+?)\.\s*$/

function cleanLines(text) {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\f/g, '').replace(FOOTER_RE, '').replace(/\s+$/, ''))
}

// Joins PDF lines back into prose. A line ends its paragraph when a blank line follows, or when it is
// clearly shorter than the wrap width and looks finished (sentence punctuation, or a very short line
// such as a signature). Everything else was wrapped by the PDF.
function joinProse(lines) {
  const width = Math.max(60, ...lines.map((l) => l.trim().length))
  const ends = (line) => line.length < width * 0.8 && (/[.!?:"”)]$/.test(line) || line.length < 40)
  const paras = []
  let cur = ''
  for (const raw of lines) {
    // forms print checkboxes as a private-use Wingdings glyph; other wide column gaps become " · "
    const line = raw
      .replace(/\s*[-]\s*/g, ' ☐ ')
      .trim()
      .replace(/:\s{3,}/g, ': ')
      .replace(/\s{3,}/g, ' · ')
    if (!line) {
      if (cur) paras.push(cur)
      cur = ''
      continue
    }
    cur = !cur ? line : cur.endsWith('-') ? cur + line : `${cur} ${line}`
    if (ends(line)) {
      paras.push(cur)
      cur = ''
    }
  }
  if (cur) paras.push(cur)
  // double-spaced text puts a blank line inside sentences: rejoin "… advance" + "booking and …"
  const merged = []
  for (const p of paras) {
    const prev = merged[merged.length - 1]
    if (prev && /[a-z,(]$/.test(prev) && /^[a-z0-9(]/.test(p)) merged[merged.length - 1] = `${prev} ${p}`
    else merged.push(p)
  }
  return merged.join('\n')
}

const isTitle = (raw) => /^ {15,}\S/.test(raw) && raw.trim().length < 90 && !/[.?:]$/.test(raw.trim())

function parseQuestions(lines) {
  const questions = []
  let q = null
  let target = null
  for (const raw of lines) {
    const line = raw.trim()
    let m
    if ((m = raw.match(QUESTION_RE)) && !OPTION_RE.test(raw)) {
      q = { number: Number(m[1]), promptLines: [m[2]], options: [] }
      questions.push(q)
      target = q.promptLines
    } else if (q && (m = raw.match(OPTION_RE))) {
      q.options.push(m[2])
      target = null
    } else if (q && line) {
      if (target) target.push(line)
      else q.options[q.options.length - 1] += ` ${line}`
    } else if (q && target) {
      target.push('')
    }
  }
  return questions.map((qq) => {
    const prompt = joinProse(qq.promptLines.map((l) => (l ? l : '')))
    // "…could be added.\n<sentence>\nWhere would the sentence best fit?" (tests 1–2) or
    // "…could be added: <sentence>" with the last line optional (tests 3–5)
    const insert = prompt.match(/sentence could be added[.:]\s*([\s\S]+?)\s*(?:Where would the sentence best fit\?[\s\S]*)?$/)
    if (insert) {
      return { number: qq.number, prompt: 'Where would the sentence best fit?', insertSentence: insert[1].replace(/\s+/g, ' ').trim(), options: qq.options }
    }
    return { number: qq.number, prompt: prompt.replace(/\s*\n\s*/g, ' '), options: qq.options }
  })
}

function parseModule(lines) {
  const start = lines.findIndex((l) => /^\s*Fill in the missing letters/.test(l))
  if (start < 0) throw new Error('Complete the Words task not found')
  let i = start + 1
  while (i < lines.length && (!lines[i].trim() || /^\s*\(Questions 1-10\)\s*$/.test(lines[i]))) i++

  const ctwLines = []
  while (i < lines.length && !READ_RE.test(lines[i])) ctwLines.push(lines[i++])
  const ctw = joinProse(ctwLines).replace(/\n/g, ' ')

  const daily = []
  let academic = null
  while (i < lines.length) {
    const read = lines[i].match(READ_RE)
    if (!read) {
      i++
      continue
    }
    const set = { genre: read[1].trim(), bodyLines: [], qLines: [] }
    i++
    while (i < lines.length && !QUESTION_RE.test(lines[i])) set.bodyLines.push(lines[i++])
    while (i < lines.length && !READ_RE.test(lines[i]) && !isTitle(lines[i])) set.qLines.push(lines[i++])
    daily.push(set)
    if (i < lines.length && isTitle(lines[i])) {
      const title = lines[i++].trim()
      const passageLines = []
      while (i < lines.length && !QUESTION_RE.test(lines[i])) passageLines.push(lines[i++])
      // insert-a-sentence places are printed as (A)…(D) in tests 1–2 and [A]…[D] in tests 3–5
      const passage = joinProse(passageLines).replace(/\[([A-D])\]/g, '($1)')
      academic = { title, passage, questions: parseQuestions(lines.slice(i)) }
      break
    }
  }
  return {
    ctw,
    daily: daily.map((d) => ({ genre: d.genre, text: joinProse(d.bodyLines), questions: parseQuestions(d.qLines) })),
    academic,
  }
}

function parseKey(lines) {
  const tokens = []
  for (const l of lines) {
    const cleaned = l.replace(KEY_RE, '').replace(/\b(Question|Number|Answer|Key)\b/g, ' ')
    for (const t of cleaned.split(/\s+/)) if (t && !/^\d+$/.test(t)) tokens.push(t)
  }
  return tokens
}

const LETTER = { A: 0, B: 1, C: 2, D: 3 }
const firstWords = (s, n) => s.split(/\s+/).slice(0, n).join(' ').replace(/[,.;:]$/, '') + '…'

function dailyTitle(d) {
  const subject = d.text.match(/^Subject:\s*(.+)$/m)
  const label = d.genre[0].toUpperCase() + d.genre.slice(1)
  return `${label}: ${subject ? subject[1].trim() : firstWords(d.text.replace(/\*\*/g, ''), 6)}`
}

function buildSets(test, moduleNo, parsed, key) {
  const source = { name: `${test.name} (Reading, Module ${moduleNo})`, url: test.url }
  const prefix = `ets-${test.tag}-m${moduleNo}`
  const ctwAnswers = key.slice(0, 10)
  const mcKey = key.slice(10)
  const problems = []

  const check = parseCtw(parsed.ctw, ctwAnswers)
  if (check.error) problems.push(`Complete the Words: ${check.error}`)
  const sets = [
    { id: `${prefix}-ctw`, type: 'ctw', title: firstWords(parsed.ctw, 6), paragraph: parsed.ctw, answers: ctwAnswers, source },
  ]

  const mcSets = [
    ...parsed.daily.map((d, n) => ({ id: `${prefix}-d${n + 1}`, type: 'daily', genre: d.genre, title: dailyTitle(d), text: d.text, questions: d.questions })),
    ...(parsed.academic ? [{ id: `${prefix}-ap`, type: 'academic', title: parsed.academic.title, passage: parsed.academic.passage, questions: parsed.academic.questions }] : []),
  ]
  let k = 0
  for (const s of mcSets) {
    for (const q of s.questions) {
      const letter = mcKey[k++]
      if (!(letter in LETTER)) problems.push(`Question ${q.number}: no A–D answer in the key (got "${letter}")`)
      if (q.options.length !== 4) problems.push(`Question ${q.number}: expected 4 options, found ${q.options.length}`)
      q.answer = LETTER[letter]
      delete q.number
    }
    sets.push({ ...s, source })
  }
  if (k !== mcKey.length) problems.push(`Answer key has ${mcKey.length} multiple-choice answers but ${k} questions were found`)
  if (!parsed.academic) problems.push('Academic passage not found')
  return { sets, problems }
}

function importTest(test) {
  const lines = cleanLines(pdfText(fileOf(test)))
  const end = lines.findIndex((l) => /^\s*Listening Section\s*$/.test(l))
  const reading = lines.slice(0, end < 0 ? lines.length : end)

  // "Reading Section, Module N" heads the module's directions, repeats on every page of tests 3–5, and also
  // heads each answer key (followed by "Answer Key"). Consecutive marks of the same kind form one region.
  const marks = []
  reading.forEach((l, idx) => {
    let m
    if ((m = l.match(KEY_RE))) marks.push({ kind: 'key', no: Number(m[1]), idx })
    else if ((m = l.match(MODULE_RE))) {
      const isKey = reading.slice(idx + 1, idx + 4).some((n) => /^\s*Answer Key\s*$/.test(n))
      marks.push({ kind: isKey ? 'key' : 'module', no: Number(m[1]), idx })
    }
  })
  const regions = []
  for (const mark of marks) {
    const prev = regions[regions.length - 1]
    if (prev && prev.kind === mark.kind && prev.no === mark.no) prev.marks.push(mark.idx)
    else regions.push({ kind: mark.kind, no: mark.no, start: mark.idx, marks: [mark.idx] })
  }
  const linesOf = (region) => {
    const next = regions[regions.indexOf(region) + 1]
    return reading
      .slice(region.start, next ? next.start : reading.length)
      .filter((_, i) => !region.marks.includes(region.start + i))
  }

  const out = []
  for (const mod of regions.filter((r) => r.kind === 'module')) {
    const keyRegion = regions.find((r) => r.kind === 'key' && r.no === mod.no)
    if (!keyRegion) throw new Error(`${test.name}: answer key for Module ${mod.no} not found`)
    const { sets, problems } = buildSets(test, mod.no, parseModule(linesOf(mod)), parseKey(linesOf(keyRegion)))
    if (problems.length) {
      console.warn(`✗ ${test.name}, Module ${mod.no} skipped:\n  - ${problems.join('\n  - ')}`)
      continue
    }
    const items = sets.reduce((n, s) => n + (s.type === 'ctw' ? s.answers.length : s.questions.length), 0)
    console.log(`✓ ${test.name}, Module ${mod.no}: ${sets.length} sets, ${items} questions`)
    out.push(...sets)
  }
  return out
}

const AUTO = process.argv.includes('--auto')

async function main() {
  if (AUTO && existsSync(OUT_FILE)) return
  mkdirSync(PDF_DIR, { recursive: true })
  const wantDownload = AUTO || process.argv.includes('--download')
  const sets = []
  for (const test of OFFICIAL_TESTS) {
    if (!existsSync(fileOf(test))) {
      if (!wantDownload) {
        console.warn(`Missing ${fileOf(test)} — run with --download, or save it there from ${test.url}`)
        continue
      }
      await download(test)
    }
    sets.push(...importTest(test))
  }
  if (!sets.length) {
    console.error('Nothing imported.')
    process.exit(1)
  }
  mkdirSync(dirname(OUT_FILE), { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify({ importedAt: new Date().toISOString(), sets }, null, 2))
  console.log(`\nWrote ${sets.length} sets to ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err.message || err)
  if (AUTO) console.warn('Reading question bank not imported — the app still starts; run `npm run import:ets -- --download` later.')
  process.exit(AUTO ? 0 : 1)
})
