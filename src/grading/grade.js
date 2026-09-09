import { gradeWithGemini } from './gemini'
import { gradeEmailHeuristic, gradeDiscussionHeuristic } from './heuristic'
import { countWords } from './convert'

export async function gradeResponse(task, response) {
  if (countWords(response.text) < 5) {
    return {
      overall: 0,
      dimensions: [],
      strengths: [],
      improvements: ['The response was blank or too short to score. On the real exam this receives 0.'],
      grammarIssues: [],
      summary: 'No scorable response.',
      grader: 'rule',
    }
  }
  try {
    const result = await gradeWithGemini(task, response)
    return { ...result, grader: 'gemini' }
  } catch (err) {
    const fallback =
      task.type === 'email'
        ? await gradeEmailHeuristic(task, response)
        : await gradeDiscussionHeuristic(task, response)
    return { ...fallback, grader: 'heuristic', graderNote: String(err?.message || err) }
  }
}
