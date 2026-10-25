import { READING_BANDS, TASK_NAMES } from '../../reading/rules'
import { ROUTE_THRESHOLD } from '../../reading/bank'

export default function ReadingResults({ result, modules, route, mode, onHome, onAgain }) {
  const sources = [...new Map(modules.flatMap((m) => m.sets).map((s) => [s.source?.name, s.source])).values()].filter(Boolean)

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
        <h1 className="results-title">Your Reading Results</h1>

        <div className="score-summary">
          <div className="score-box accent">
            <div className="score-big">{result.band}<span className="score-of">/6</span></div>
            <div className="score-label">Reading band · CEFR {result.cefr}</div>
          </div>
          <div className="score-box">
            <div className="score-big">{result.score30}<span className="score-of">/30</span></div>
            <div className="score-label">Reading section score (0–30 scale)</div>
          </div>
          <div className="score-box">
            <div className="score-big small">{result.correct} / {result.total}</div>
            <div className="score-label">
              Points — Module 1: {result.perModule[0]?.correct ?? 0}/{result.perModule[0]?.total ?? 0}
              {result.perModule[1] && <>, Module 2: {result.perModule[1].correct}/{result.perModule[1].total}</>}
            </div>
          </div>
        </div>
        <p className="estimate-note">
          Marked like the real test: 1 point per correct item, exact match, no partial credit. ETS's conversion from raw
          points uses unpublished equating, so the 0–30 score here is your share of points × 30, read against the
          official ETS band table.{' '}
          {route ? (
            <>
              Module 1 sent you to the <strong>{route === 'upper' ? 'harder' : 'easier'} Module 2</strong> (this app routes at{' '}
              {Math.round(ROUTE_THRESHOLD * 100)}% correct).
            </>
          ) : (
            <>Estimated from one module only — take the full section for a more reliable band.</>
          )}
        </p>

        <div className="task-result">
          <h2>By task and skill</h2>
          <div className="dims">
            {[...result.byTask, ...result.bySkill.filter((s) => s.name !== 'Complete the Words')].map((row, i) => (
              <div className={`dim ${i === result.byTask.length ? 'dim-gap' : ''}`} key={row.name}>
                <div className="dim-top">
                  <span className="dim-name">{row.name}</span>
                  <span className="dim-score">{row.correct}/{row.total}</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${(row.correct / row.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {modules.map((m, mi) => (
          <div className="task-result" key={mi}>
            <h2>{modules.length > 1 ? `Module ${mi + 1} — review` : 'Review'}</h2>
            {m.sets.map((set) => (
              <ReviewSet key={set.id} set={set} items={result.items.filter((it) => it.set.id === set.id)} />
            ))}
          </div>
        ))}

        <div className="convtable">
          <h3>Official ETS score comparison (Reading)</h3>
          <table>
            <thead>
              <tr><th>Band (1–6)</th><th>Reading (0–30)</th><th>CEFR</th></tr>
            </thead>
            <tbody>
              {READING_BANDS.map((r) => (
                <tr key={r.band} className={r.band === result.band ? 'hl' : ''}>
                  <td>{r.band}</td>
                  <td>{r.min === r.max ? r.min : `${r.min}–${r.max}`}</td>
                  <td>{r.cefr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sources.length > 0 && (
          <p className="home-foot">
            Questions from:{' '}
            {sources.map((s, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.name}</a> : s.name}
              </span>
            ))}
          </p>
        )}

        <div className="results-actions">
          <button className="btn big" onClick={onHome}>Back to Home</button>{' '}
          <button className="btn primary big" onClick={onAgain}>{mode === 'module' ? 'Another Module' : 'New Reading Test'}</button>
        </div>
      </main>
    </div>
  )
}

function ReviewSet({ set, items }) {
  const right = items.filter((i) => i.correct).length
  return (
    <details className="review-set">
      <summary>
        <span className="review-type">{TASK_NAMES[set.type]}</span> {set.title}
        <span className={`review-score ${right === items.length ? 'all' : ''}`}>{right}/{items.length}</span>
      </summary>
      {set.type === 'ctw' ? (
        <div className="review-ctw">
          {items.map((it, i) => (
            <span key={i} className={`review-word ${it.correct ? 'ok' : 'bad'}`}>
              {it.stem}<strong>{it.answer}</strong>
              {!it.correct && <em> (you: {it.stem}{it.given.trim() || '—'})</em>}
            </span>
          ))}
        </div>
      ) : (
        <ol className="review-qs">
          {items.map((it, i) => (
            <li key={i} className={it.correct ? 'ok' : 'bad'}>
              <div className="review-prompt">
                {it.q.insertSentence ? <>Where does “{it.q.insertSentence}” fit?</> : it.q.prompt}
                <span className="review-skill">{it.skill}</span>
              </div>
              <div>Correct: <strong>{it.q.options[it.answer]}</strong></div>
              {!it.correct && <div>Your answer: {it.given === undefined ? '— (no answer)' : it.q.options[it.given]}</div>}
            </li>
          ))}
        </ol>
      )}
    </details>
  )
}
