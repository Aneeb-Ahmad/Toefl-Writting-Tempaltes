import { useState } from 'react'
import { EMAIL_TEMPLATES } from '../data/emailTemplates'
import { DISCUSSION_TEMPLATES } from '../data/discussionTemplates'
import { getDone, resetProgress } from '../storage'
import { bankSummary, getAllSets } from '../reading/bank'

export default function HomeScreen({ onStart }) {
  const [, refresh] = useState(0)
  const emailDone = getDone('email').filter((id) => EMAIL_TEMPLATES.some((t) => t.id === id)).length
  const discDone = getDone('discussion').filter((id) => DISCUSSION_TEMPLATES.some((t) => t.id === id)).length
  const bank = bankSummary()
  const readingSets = getAllSets()
  const readingDone = getDone('reading').filter((id) => readingSets.some((s) => s.id === id)).length

  return (
    <div className="exam-root home-root">
      <header className="topbar">
        <div className="logo">
          <span className="logo-star">*</span>toefl <span className="logo-ibt">ibt</span><span className="logo-dot">.</span>
        </div>
        <div className="topbar-note">Reading &amp; Writing Practice</div>
      </header>

      <main className="home-main">
        <h1 className="home-title">TOEFL iBT Practice</h1>
        <p className="home-sub">
          Real exam timing and interface for the January 2026 TOEFL iBT. Reading is marked by the official rules — one
          point per item — and reported on the 1–6 band. Writing is scored with AI on the official ETS 0–5 rubric.
        </p>

        <h2 className="home-section">Reading</h2>
        <div className="cards">
          <div className="card featured">
            <div className="card-tag">FULL SECTION</div>
            <h2>Reading Section</h2>
            <p className="card-desc">
              Module 1 → Module 2 (adaptive) — <strong>40 questions, 24 minutes</strong>. Complete the Words, Read in Daily
              Life, Read an Academic Passage.
            </p>
            <p className="progress">
              {readingSets.length
                ? `${bank.ctw} paragraphs · ${bank.daily} daily-life texts · ${bank.academic} passages — ${readingDone} of ${readingSets.length} sets practiced`
                : 'No sets yet — the official ETS tests load when the app starts online.'}
            </p>
            <button className="btn primary big" disabled={!readingSets.length} onClick={() => onStart('readingFull')}>Start Full Reading</button>
          </div>

          <div className="card">
            <div className="card-tag">PRACTICE</div>
            <h2>Single Module</h2>
            <p className="card-desc">
              One module — <strong>20 questions, 12 minutes</strong> — with all three task types, then your results.
            </p>
            <button className="btn primary" disabled={!readingSets.length} onClick={() => onStart('readingModule')}>Practice One Module</button>
          </div>
        </div>

        <h2 className="home-section">Writing</h2>
        <div className="cards">
          <div className="card featured">
            <div className="card-tag">FULL TEST</div>
            <h2>Writing Section</h2>
            <p className="card-desc">
              Question 1: Write an Email — <strong>7 minutes</strong>
              <br />
              Question 2: Academic Discussion — <strong>10 minutes</strong>
            </p>
            <p className="card-desc">Complete results and band score at the end, just like the real exam.</p>
            <button className="btn primary big" onClick={() => onStart('full')}>Start Full Test</button>
          </div>

          <div className="card">
            <div className="card-tag">PRACTICE</div>
            <h2>Write an Email</h2>
            <p className="card-desc">One email task, 7 minutes. Formal and informal scenarios.</p>
            <p className="progress">{emailDone} of {EMAIL_TEMPLATES.length} templates completed</p>
            <button className="btn primary" onClick={() => onStart('email')}>Practice Email</button>
          </div>

          <div className="card">
            <div className="card-tag">PRACTICE</div>
            <h2>Academic Discussion</h2>
            <p className="card-desc">One discussion post, 10 minutes. At least 100 words.</p>
            <p className="progress">{discDone} of {DISCUSSION_TEMPLATES.length} templates completed</p>
            <button className="btn primary" onClick={() => onStart('discussion')}>Practice Discussion</button>
          </div>
        </div>

        <p className="home-foot">
          Unofficial practice tool — scores are estimates based on the official ETS rubric and score-comparison table.{' '}
          <button
            className="linklike"
            onClick={() => {
              if (window.confirm('Reset your template progress? Your practice history marks will be cleared.')) {
                resetProgress()
                refresh((n) => n + 1)
              }
            }}
          >
            Reset progress
          </button>
        </p>
      </main>
    </div>
  )
}
