import { CONVERSION_TABLE, toWriting30, rowForWriting30, countWords } from '../grading/convert'

const TASK_NAMES = { email: 'Write an Email', discussion: 'Academic Discussion' }

export default function ResultsScreen({ plan, responses, results, onHome }) {
  const avg = results.reduce((s, r) => s + r.overall, 0) / results.length
  const writing30 = toWriting30(avg)
  const row = rowForWriting30(writing30)
  const isFull = results.length === 2

  return (
    <div className="exam-root results-root">
      <header className="topbar">
        <div className="logo">
          <span className="logo-star">*</span>toefl <span className="logo-ibt">ibt</span><span className="logo-dot">.</span>
        </div>
        <div className="topbar-actions">
          <button className="pill" onClick={onHome}>Home ›</button>
        </div>
      </header>

      <main className="results-main">
        <h1 className="results-title">Your Writing Results</h1>

        <div className="score-summary">
          <div className="score-box">
            <div className="score-big">{writing30}<span className="score-of">/30</span></div>
            <div className="score-label">Writing section score</div>
          </div>
          <div className="score-box accent">
            <div className="score-big">{row.band}<span className="score-of">/6</span></div>
            <div className="score-label">Band (CEFR-aligned scale)</div>
          </div>
          <div className="score-box">
            <div className="score-big small">{row.total}</div>
            <div className="score-label">Estimated total (0–120) if all sections match this level</div>
          </div>
        </div>
        {!isFull && (
          <p className="estimate-note">Estimated from one task only — take the full test for a more reliable score.</p>
        )}

        {results.map((r, i) => (
          <div className="task-result" key={i}>
            <div className="task-result-head">
              <h2>
                Question {i + 1}: {TASK_NAMES[plan[i].type]}
                <span className="tmpl-name"> — “{plan[i].template.title}”</span>
              </h2>
              <div className={`chip score-chip s${r.overall}`}>{r.overall} / 5</div>
            </div>
            <p className="grader-note">
              {r.grader === 'gemini'
                ? `Scored by Gemini AI (${r.model}) using the official ETS rubric.`
                : r.grader === 'heuristic'
                  ? 'Scored by the built-in rubric engine (AI grader was unavailable).'
                  : 'Not scorable.'}
            </p>
            {r.summary && <p className="summary">{r.summary}</p>}

            {r.dimensions.length > 0 && (
              <div className="dims">
                {r.dimensions.map((d, j) => (
                  <div className="dim" key={j}>
                    <div className="dim-top">
                      <span className="dim-name">{d.name}</span>
                      <span className="dim-score">{d.score}/5</span>
                    </div>
                    <div className="bar">
                      <div className="bar-fill" style={{ width: `${(d.score / 5) * 100}%` }} />
                    </div>
                    <div className="dim-comment">{d.comment}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="fb-cols">
              {r.strengths.length > 0 && (
                <div className="fb good">
                  <h3>Strengths</h3>
                  <ul>{r.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                </div>
              )}
              {r.improvements.length > 0 && (
                <div className="fb warn">
                  <h3>To improve</h3>
                  <ul>{r.improvements.map((s, j) => <li key={j}>{s}</li>)}</ul>
                </div>
              )}
            </div>

            {r.grammarIssues.length > 0 && (
              <div className="grammar">
                <h3>Language issues found</h3>
                <table>
                  <thead>
                    <tr><th>You wrote</th><th>Problem</th><th>Better</th></tr>
                  </thead>
                  <tbody>
                    {r.grammarIssues.map((g, j) => (
                      <tr key={j}>
                        <td className="gi-quote">“{g.quote}”</td>
                        <td>{g.problem}</td>
                        <td className="gi-fix">{g.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <details className="your-text">
              <summary>Your response ({countWords(responses[i].text)} words)</summary>
              <pre>{responses[i].text || '(blank)'}</pre>
            </details>
          </div>
        ))}

        <div className="convtable">
          <h3>Official ETS score comparison (Writing)</h3>
          <table>
            <thead>
              <tr><th>Band (1–6)</th><th>Writing (0–30)</th><th>Total (0–120)</th></tr>
            </thead>
            <tbody>
              {CONVERSION_TABLE.map((r2) => (
                <tr key={r2.band} className={r2.band === row.band ? 'hl' : ''}>
                  <td>{r2.band}</td>
                  <td>{r2.writing[0]}–{r2.writing[1]}</td>
                  <td>{r2.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="results-actions">
          <button className="btn primary big" onClick={onHome}>Back to Home</button>
        </div>
      </main>
    </div>
  )
}
