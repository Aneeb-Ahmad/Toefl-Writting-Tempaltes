import { GEMINI_API_KEY, GEMINI_MODELS } from '../config'
import { emailTaskIntro } from '../data/emailTemplates'
import { discussionIntro } from '../data/discussionTemplates'
import { countWords } from './convert'

const EMAIL_RUBRIC = `OFFICIAL ETS RUBRIC — WRITE AN EMAIL (score 0-5):
5: Relevant, very clearly expressed email that fully accomplishes all three communicative goals with well-elaborated details. Appropriate register/tone for the recipient. Variety of syntactic structures, precise word choice, almost no lexical or grammatical errors.
4: Accomplishes all three goals adequately with some elaboration. Mostly appropriate tone. A variety of structures and appropriate word choice; few errors that do not obscure meaning.
3: Partially successful. All goals attempted but part of a goal, example, or detail is missing, unclear, or irrelevant. Noticeable grammatical errors or limited vocabulary; tone may be partly inappropriate.
2: Mostly unsuccessful. One or more goals missing or barely developed; limitations in language make ideas hard to follow; frequent errors.
1: Ineffective attempt; seriously limited range of structures; mostly incomprehensible or almost entirely undeveloped.
0: Blank, off-topic, copied from the prompt, or not in English.`

const DISCUSSION_RUBRIC = `OFFICIAL ETS RUBRIC — WRITING FOR AN ACADEMIC DISCUSSION (score 0-5):
5: Relevant and very clearly expressed contribution to the online discussion; adds the writer's own perspective (not copying classmates). Well-elaborated explanations, examples and details. Wide variety of syntactic structures, precise idiomatic word choice, almost no lexical or grammatical errors.
4: Relevant contribution, easily understood, with adequate elaboration. Variety of structures and appropriate vocabulary; few errors.
3: Mostly relevant and understandable contribution, but elaboration is partly missing, unclear, or repetitive. Noticeable errors in structures or word choice.
2: Attempt is only partly successful; ideas are hard to follow; limited range of vocabulary and structures; accumulation of errors.
1: Ineffective attempt; words strung together with severely limited language; barely connected to the discussion.
0: Blank, off-topic, copied from the prompt or classmates' posts, or not in English.`

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    overall: { type: 'INTEGER', description: 'Overall rubric score from 0 to 5' },
    dimensions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          score: { type: 'NUMBER', description: '0 to 5' },
          comment: { type: 'STRING' },
        },
        required: ['name', 'score', 'comment'],
      },
    },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    improvements: { type: 'ARRAY', items: { type: 'STRING' } },
    grammarIssues: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          quote: { type: 'STRING', description: 'The exact incorrect text from the response' },
          problem: { type: 'STRING' },
          fix: { type: 'STRING', description: 'The corrected version' },
        },
        required: ['quote', 'problem', 'fix'],
      },
    },
    summary: { type: 'STRING', description: '2-3 sentence overall feedback for the student' },
  },
  required: ['overall', 'dimensions', 'strengths', 'improvements', 'summary'],
}

function buildPrompt(task, response) {
  const t = task.template
  const words = countWords(response.text)
  if (task.type === 'email') {
    return `You are an official ETS TOEFL iBT rater. Score the following "Write an Email" response strictly according to the rubric. Be realistic and calibrated like a real ETS rater: do not inflate scores.

${EMAIL_RUBRIC}

TASK SHOWN TO THE STUDENT:
Scenario: ${t.scenario}
${emailTaskIntro(t)}
1. ${t.bullets[0]}
2. ${t.bullets[1]}
3. ${t.bullets[2]}
Expected tone: ${t.kind === 'formal' ? 'formal/polite (professional recipient)' : 'informal/friendly (friend or classmate)'}.
Time limit: 7 minutes. Recommended length: about 100-120 words.

STUDENT'S RESPONSE (${words} words, written in ${Math.round(response.secondsUsed / 60)} min ${response.secondsUsed % 60} sec):
"""
${response.text}
"""

Evaluate the 4 dimensions with these exact names: "Task fulfillment (3 bullet points)", "Tone & register", "Language use (grammar & vocabulary)", "Organization". List concrete grammar/vocabulary/spelling issues you find (quote + problem + fix), up to 8. Small typos are expected in timed writing and should not heavily lower the score. Give the overall score as an integer 0-5 per the rubric.`
  }
  return `You are an official ETS TOEFL iBT rater. Score the following "Writing for an Academic Discussion" response strictly according to the rubric. Be realistic and calibrated like a real ETS rater: do not inflate scores.

${DISCUSSION_RUBRIC}

TASK SHOWN TO THE STUDENT:
${discussionIntro(t)}
Professor ${t.professor} wrote: ${t.question}
Classmate ${t.students[0].name} wrote: ${t.students[0].text}
Classmate ${t.students[1].name} wrote: ${t.students[1].text}
Requirements shown: express and support your opinion; make a contribution to the discussion in your own words; an effective response contains at least 100 words.
Time limit: 10 minutes.

STUDENT'S RESPONSE (${words} words, written in ${Math.round(response.secondsUsed / 60)} min ${response.secondsUsed % 60} sec):
"""
${response.text}
"""

Evaluate the 4 dimensions with these exact names: "Relevant contribution & own perspective", "Support & development (examples)", "Syntactic variety & vocabulary", "Language accuracy". Check specifically whether the student copied the classmates' ideas or added something new. List concrete grammar/vocabulary/spelling issues (quote + problem + fix), up to 8. Small typos are expected in timed writing. Give the overall score as an integer 0-5 per the rubric.`
}

async function callModel(model, prompt) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60000)
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      }
    )
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} from ${model}: ${errText.slice(0, 200)}`)
    }
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
    if (!text) throw new Error(`Empty response from ${model}`)
    return JSON.parse(text.replace(/^```json\s*/i, '').replace(/```\s*$/, ''))
  } finally {
    clearTimeout(timer)
  }
}

export async function gradeWithGemini(task, response) {
  const prompt = buildPrompt(task, response)
  let lastError = null
  for (const model of GEMINI_MODELS) {
    try {
      const raw = await callModel(model, prompt)
      const overall = Math.max(0, Math.min(5, Math.round(Number(raw.overall) || 0)))
      return {
        overall,
        dimensions: (raw.dimensions || []).map((d) => ({
          name: String(d.name || ''),
          score: Math.max(0, Math.min(5, Number(d.score) || 0)),
          comment: String(d.comment || ''),
        })),
        strengths: (raw.strengths || []).map(String),
        improvements: (raw.improvements || []).map(String),
        grammarIssues: (raw.grammarIssues || []).map((g) => ({
          quote: String(g.quote || ''),
          problem: String(g.problem || ''),
          fix: String(g.fix || ''),
        })),
        summary: String(raw.summary || ''),
        model,
      }
    } catch (e) {
      lastError = e
    }
  }
  throw lastError || new Error('All Gemini models failed')
}
