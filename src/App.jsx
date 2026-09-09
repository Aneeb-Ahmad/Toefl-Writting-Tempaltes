import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import TaskScreen from './components/TaskScreen'
import ResultsScreen from './components/ResultsScreen'
import { EMAIL_TEMPLATES } from './data/emailTemplates'
import { DISCUSSION_TEMPLATES } from './data/discussionTemplates'
import { pickTemplate, markDone } from './storage'
import { gradeResponse } from './grading/grade'
import { EMAIL_SECONDS, DISCUSSION_SECONDS } from './config'

function buildPlan(mode) {
  const tasks = []
  if (mode === 'full' || mode === 'email') {
    tasks.push({ type: 'email', seconds: EMAIL_SECONDS, template: pickTemplate('email', EMAIL_TEMPLATES) })
  }
  if (mode === 'full' || mode === 'discussion') {
    tasks.push({ type: 'discussion', seconds: DISCUSSION_SECONDS, template: pickTemplate('discussion', DISCUSSION_TEMPLATES) })
  }
  return tasks
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [plan, setPlan] = useState([])
  const [idx, setIdx] = useState(0)
  const [responses, setResponses] = useState([])
  const [results, setResults] = useState(null)
  const [gradingNote, setGradingNote] = useState('')

  function startExam(mode) {
    setPlan(buildPlan(mode))
    setIdx(0)
    setResponses([])
    setResults(null)
    setScreen('exam')
  }

  function handleTaskComplete(text, secondsUsed) {
    const updated = [...responses, { text, secondsUsed }]
    setResponses(updated)
    if (idx + 1 < plan.length) {
      setIdx(idx + 1)
    } else {
      setScreen('grading')
      runGrading(updated)
    }
  }

  async function runGrading(finalResponses) {
    const out = []
    for (let i = 0; i < plan.length; i++) {
      setGradingNote(`Scoring your response ${i + 1} of ${plan.length}…`)
      const result = await gradeResponse(plan[i], finalResponses[i])
      out.push(result)
      markDone(plan[i].type, plan[i].template.id)
    }
    setResults(out)
    setScreen('results')
  }

  if (screen === 'home') return <HomeScreen onStart={startExam} />

  if (screen === 'exam') {
    return (
      <TaskScreen
        key={idx}
        task={plan[idx]}
        questionNumber={idx + 1}
        totalQuestions={plan.length}
        onComplete={handleTaskComplete}
      />
    )
  }

  if (screen === 'grading') {
    return (
      <div className="exam-root grading-root">
        <header className="topbar">
          <div className="logo">
            <span className="logo-star">*</span>toefl <span className="logo-ibt">ibt</span><span className="logo-dot">.</span>
          </div>
        </header>
        <main className="grading-main">
          <div className="spinner" />
          <h2>Scoring in progress</h2>
          <p>{gradingNote}</p>
          <p className="grading-hint">Your responses are being rated on the official ETS 0–5 rubric.</p>
        </main>
      </div>
    )
  }

  return <ResultsScreen plan={plan} responses={responses} results={results} onHome={() => setScreen('home')} />
}
