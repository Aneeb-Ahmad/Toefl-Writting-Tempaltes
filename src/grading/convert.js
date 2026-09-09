// Official ETS score comparison table (writing section column).
export const CONVERSION_TABLE = [
  { band: 6, writing: [29, 30], total: '114+' },
  { band: 5.5, writing: [27, 28], total: '107+' },
  { band: 5, writing: [24, 26], total: '95+' },
  { band: 4.5, writing: [21, 23], total: '86+' },
  { band: 4, writing: [17, 20], total: '72+' },
  { band: 3.5, writing: [15, 16], total: '58+' },
  { band: 3, writing: [13, 14], total: '44+' },
  { band: 2.5, writing: [11, 12], total: '34+' },
  { band: 2, writing: [7, 10], total: '24+' },
  { band: 1.5, writing: [3, 6], total: '12+' },
  { band: 1, writing: [0, 2], total: '0+' },
]

// Average rubric score (0-5) scaled onto the 0-30 writing section score.
export function toWriting30(avg0to5) {
  return Math.max(0, Math.min(30, Math.round((avg0to5 / 5) * 30)))
}

export function rowForWriting30(score30) {
  for (const row of CONVERSION_TABLE) {
    if (score30 >= row.writing[0] && score30 <= row.writing[1]) return row
  }
  return CONVERSION_TABLE[CONVERSION_TABLE.length - 1]
}

export function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0
}
