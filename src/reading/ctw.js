// "Complete the Words" paragraphs are written the way ETS prints them: a word stem followed by one
// underscore per missing letter ("Th_ _", "sophis_ _ _ _ _ _ _", "tr _ _ _"). The missing letters come
// from the answer key, in order. Pure functions — shared by the app and the ETS import script.

const BLANK_RE = /([A-Za-z'’-]*)[ \t]?((?:_[ \t]?)*_)/g

// Returns { segments, blanks, error }. segments: [{ type: 'text', text } | { type: 'blank', index, stem, answer }]
export function parseCtw(paragraph, answers) {
  const segments = []
  let last = 0
  let index = 0
  let m
  BLANK_RE.lastIndex = 0
  while ((m = BLANK_RE.exec(paragraph))) {
    if (m.index > last) segments.push({ type: 'text', text: paragraph.slice(last, m.index) })
    segments.push({ type: 'blank', index, stem: m[1], answer: (answers[index] ?? '').trim(), shown: m[2].split('_').length - 1 })
    index++
    last = BLANK_RE.lastIndex
    // "n_ _unique" in the PDF has lost the space before the next word.
    if (/[A-Za-z]/.test(paragraph[last] ?? '')) segments.push({ type: 'text', text: ' ' })
  }
  if (last < paragraph.length) segments.push({ type: 'text', text: paragraph.slice(last) })

  let error = ''
  if (index === 0) error = 'No blanks found. Write each blank as the word stem followed by underscores, e.g. "Th_ _".'
  else if (answers.length !== index) error = `Found ${index} blanks but ${answers.length} answers.`
  else if (answers.some((a) => !/^[A-Za-z'’-]+$/.test(a.trim()))) error = 'Each answer must be only the missing letters.'
  return { segments, blanks: index, error }
}

export const sameLetters = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()
