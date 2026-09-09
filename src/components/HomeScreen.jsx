import { useState } from 'react'
import { EMAIL_TEMPLATES } from '../data/emailTemplates'
import { DISCUSSION_TEMPLATES } from '../data/discussionTemplates'
import { getDone, resetProgress } from '../storage'

export default function HomeScreen({ onStart }) {
  const [, refresh] = useState(0)
  const emailDone = getDone('email').filter((id) => EMAIL_TEMPLATES.some((t) => t.id === id)).length
  const discDone = getDone('discussion').filter((id) => DISCUSSION_TEMPLATES.some((t) => t.id === id)).length

  return (
    <div className="exam-root home-root">
      <header className="topbar">
        <div className="logo">
          <span className="logo-star">*</span>toefl <span className="logo-ibt">ibt</span><span className="logo-dot">.</span>
        </div>
        <div className="topbar-note">Writing Practice</div>
      </header>

      <main className="home-main">
        <h1 className="home-title">TOEFL iBT Writing Practice</h1>
        <p className="home-sub">
          Real exam timing and interface. Scored with AI on the official ETS 0–5 rubric, then converted to the official
          0–30 writing score and 1–6 band.
        </p>

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
