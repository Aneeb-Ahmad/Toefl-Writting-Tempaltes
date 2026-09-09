// Offline fallback grader: follows the ETS rubric dimensions mechanically.
// Used automatically only when the Gemini API is unreachable or out of quota.
import { countWords } from './convert'
import { EMAIL_TARGET_WORDS, DISCUSSION_MIN_WORDS } from '../config'

const TRANSITIONS = [
  'however', 'furthermore', 'moreover', 'therefore', 'consequently', 'additionally', 'in addition',
  'for example', 'for instance', 'on the other hand', 'in my opinion', 'in conclusion', 'firstly',
  'secondly', 'finally', 'as a result', 'although', 'while', 'because', 'since', 'whereas', 'despite',
]
const FORMAL_MARKERS = ['dear', 'would it be possible', 'i would like', 'i am writing', 'could you please', 'i would appreciate', 'sincerely', 'best regards', 'kind regards', 'thank you for', 'yours']
const INFORMAL_MARKERS = ['hey', 'hi ', "what's up", 'thanks a lot', 'see you', 'cheers', 'talk soon', "can't wait", 'btw', 'gonna', 'wanna']

async function checkGrammar(text) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text, language: 'en-US' }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    return (data.matches || []).slice(0, 8).map((m) => ({
      quote: text.slice(m.offset, m.offset + m.length),
      problem: m.message,
      fix: m.replacements?.[0]?.value || '—',
    }))
  } catch {
    return null
  }
}

const clamp5 = (n) => Math.max(0, Math.min(5, n))
const lower = (t) => t.toLowerCase()

function lengthScore(words, target) {
  if (words >= target) return 5
  if (words >= target * 0.8) return 4.5
  if (words >= target * 0.6) return 3.5
  if (words >= target * 0.4) return 2.5
  if (words >= target * 0.2) return 1.5
  return 0.5
}

function varietyScore(text) {
  const t = lower(text)
  const transitions = TRANSITIONS.filter((w) => t.includes(w)).length
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2)
  const longSentences = sentences.filter((s) => countWords(s) >= 12).length
  return clamp5(1.5 + Math.min(transitions, 4) * 0.6 + Math.min(longSentences, 3) * 0.4)
}

function accuracyScore(issueCount, words) {
  if (issueCount === null || words === 0) return null // grammar API unavailable
  const per100 = (issueCount / words) * 100
  if (per100 <= 2) return 5
  if (per100 <= 4) return 4
  if (per100 <= 7) return 3
  if (per100 <= 10) return 2
  return 1
}

export async function gradeEmailHeuristic(task, response) {
  const t = task.template
  const text = response.text
  const low = lower(text)
  const words = countWords(text)

  const covered = t.keywords.map((set) => set.some((k) => low.includes(k)))
  const coveredCount = covered.filter(Boolean).length
  const taskScore = clamp5(coveredCount / 3 * 4 + Math.min(1, lengthScore(words, EMAIL_TARGET_WORDS) / 5))

  const formalHits = FORMAL_MARKERS.filter((m) => low.includes(m)).length
  const informalHits = INFORMAL_MARKERS.filter((m) => low.includes(m)).length
  let toneScore
  if (t.kind === 'formal') {
    toneScore = clamp5(2 + formalHits * 1.2 - informalHits * 1.5)
  } else {
    toneScore = clamp5(3 + Math.min(informalHits + formalHits, 2))
  }

  const issues = await checkGrammar(text)
  const acc = accuracyScore(issues ? issues.length : null, words)
  const langScore = acc === null ? 3.5 : acc
  const orgScore = clamp5((/^(dear|hi|hey|hello)/i.test(text.trim()) ? 2 : 0.5) + (/(regards|sincerely|thanks|thank you|see you|best|yours)[\s,!.]*\w*\s*$/i.test(text.trim()) ? 2 : 0.5) + 1)

  const overall = Math.round(clamp5(taskScore * 0.4 + toneScore * 0.15 + langScore * 0.3 + orgScore * 0.15))
  const missing = t.bullets.filter((_, i) => !covered[i])

  return {
    overall,
    dimensions: [
      { name: 'Task fulfillment (3 bullet points)', score: Math.round(taskScore * 2) / 2, comment: `${coveredCount} of 3 bullet points appear to be addressed.` },
      { name: 'Tone & register', score: Math.round(toneScore * 2) / 2, comment: t.kind === 'formal' ? 'A formal, polite tone was expected for this recipient.' : 'A friendly, informal tone was expected for this recipient.' },
      { name: 'Language use (grammar & vocabulary)', score: Math.round(langScore * 2) / 2, comment: issues === null ? 'Grammar checker was unreachable; a neutral score was applied.' : `${issues.length} potential language issue(s) detected.` },
      { name: 'Organization', score: Math.round(orgScore * 2) / 2, comment: 'Checked for a greeting, a body, and a closing.' },
    ],
    strengths: [
      words >= EMAIL_TARGET_WORDS * 0.8 ? `Good length (${words} words).` : null,
      coveredCount === 3 ? 'All three bullet points were addressed.' : null,
    ].filter(Boolean),
    improvements: [
      ...missing.map((b) => `This point seems missing or too brief: "${b}"`),
      words < EMAIL_TARGET_WORDS * 0.8 ? `Aim for about 100–120 words (you wrote ${words}).` : null,
    ].filter(Boolean),
    grammarIssues: issues || [],
    summary: `Estimated score ${overall}/5 from the built-in rubric engine. ${coveredCount}/3 bullet points detected, ${words} words written.`,
  }
}

export async function gradeDiscussionHeuristic(task, response) {
  const t = task.template
  const text = response.text
  const low = lower(text)
  const words = countWords(text)

  const opinionMarkers = ['i think', 'i believe', 'in my opinion', 'i agree', 'i disagree', 'in my view', 'from my perspective']
  const hasOpinion = opinionMarkers.some((m) => low.includes(m))
  const mentionsPeers = t.students.some((s) => low.includes(s.name.toLowerCase()))

  // Rough plagiarism check: long chunks copied from classmates' posts
  const copied = t.students.some((s) => {
    const src = lower(s.text)
    for (let i = 0; i + 60 <= low.length; i += 20) {
      if (src.includes(low.slice(i, i + 60))) return true
    }
    return false
  })

  const contribScore = copied ? 1 : clamp5(1 + (hasOpinion ? 2 : 0.5) + (mentionsPeers ? 1 : 0) + Math.min(1, words / DISCUSSION_MIN_WORDS))
  const supportScore = clamp5(lengthScore(words, DISCUSSION_MIN_WORDS) * 0.6 + (low.includes('for example') || low.includes('for instance') ? 1.5 : 0.5) + 0.5)
  const varScore = varietyScore(text)
  const issues = await checkGrammar(text)
  const acc = accuracyScore(issues ? issues.length : null, words)
  const langScore = acc === null ? 3.5 : acc

  const overall = Math.round(clamp5(contribScore * 0.3 + supportScore * 0.25 + varScore * 0.2 + langScore * 0.25))

  return {
    overall,
    dimensions: [
      { name: 'Relevant contribution & own perspective', score: Math.round(contribScore * 2) / 2, comment: copied ? 'Parts of the response appear copied from the classmates’ posts.' : hasOpinion ? 'A clear personal opinion was detected.' : 'No clear opinion phrase (e.g., "I believe…") was detected.' },
      { name: 'Support & development (examples)', score: Math.round(supportScore * 2) / 2, comment: `Response length: ${words} words (at least ${DISCUSSION_MIN_WORDS} expected).` },
      { name: 'Syntactic variety & vocabulary', score: Math.round(varScore * 2) / 2, comment: 'Checked transition words and sentence complexity.' },
      { name: 'Language accuracy', score: Math.round(langScore * 2) / 2, comment: issues === null ? 'Grammar checker was unreachable; a neutral score was applied.' : `${issues.length} potential language issue(s) detected.` },
    ],
    strengths: [
      hasOpinion ? 'You stated a clear opinion.' : null,
      mentionsPeers ? 'You engaged with a classmate’s point — excellent for this task.' : null,
      words >= DISCUSSION_MIN_WORDS ? `Good length (${words} words).` : null,
    ].filter(Boolean),
    improvements: [
      !hasOpinion ? 'State your position explicitly (e.g., "In my opinion…").' : null,
      !mentionsPeers ? `Refer to ${t.students[0].name} or ${t.students[1].name} to add to the discussion.` : null,
      words < DISCUSSION_MIN_WORDS ? `Write at least 100 words (you wrote ${words}).` : null,
      copied ? 'Use your own words — copying classmates can score 0 on the real exam.' : null,
    ].filter(Boolean),
    grammarIssues: issues || [],
    summary: `Estimated score ${overall}/5 from the built-in rubric engine. ${words} words written.`,
  }
}
