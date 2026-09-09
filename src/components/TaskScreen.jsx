import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import Modal from './Modal'
import { emailTaskIntro } from '../data/emailTemplates'
import { discussionIntro } from '../data/discussionTemplates'
import { countWords } from '../grading/convert'

const pad = (n) => String(n).padStart(2, '0')
const fmt = (sec) => `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`

export default function TaskScreen({ task, questionNumber, totalQuestions, onComplete }) {
  const t = task.template
  const taRef = useRef(null)

  const [value, setValue] = useState('')
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  const [clip, setClip] = useState('')
  const [hasSelection, setHasSelection] = useState(false)

  const [secondsLeft, setSecondsLeft] = useState(task.seconds)
  const [expired, setExpired] = useState(false)
  const [showTime, setShowTime] = useState(true)
  const [showWords, setShowWords] = useState(true)
  const [confirmNext, setConfirmNext] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0 || expired) return
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, expired])

  useEffect(() => {
    if (secondsLeft === 0 && !expired) setExpired(true)
  }, [secondsLeft, expired])

  function applyChange(next) {
    setPast((p) => [...p, value])
    setFuture([])
    setValue(next)
  }

  function moveCaret(pos) {
    requestAnimationFrame(() => {
      const ta = taRef.current
      if (ta) {
        ta.focus()
        ta.setSelectionRange(pos, pos)
      }
    })
  }

  function updateSelection() {
    const ta = taRef.current
    if (ta) setHasSelection(ta.selectionStart !== ta.selectionEnd)
  }

  function doCut() {
    const ta = taRef.current
    if (!ta || expired) return
    const s = ta.selectionStart
    const e = ta.selectionEnd
    if (s === e) return
    setClip(value.slice(s, e))
    applyChange(value.slice(0, s) + value.slice(e))
    setHasSelection(false)
    moveCaret(s)
  }

  function doPaste() {
    const ta = taRef.current
    if (!ta || expired || !clip) return
    const s = ta.selectionStart
    const e = ta.selectionEnd
    applyChange(value.slice(0, s) + clip + value.slice(e))
    moveCaret(s + clip.length)
  }

  function doUndo() {
    if (!past.length || expired) return
    const prev = past[past.length - 1]
    setFuture((f) => [value, ...f])
    setPast((p) => p.slice(0, -1))
    setValue(prev)
  }

  function doRedo() {
    if (!future.length || expired) return
    const next = future[0]
    setPast((p) => [...p, value])
    setFuture((f) => f.slice(1))
    setValue(next)
  }

  const wordCount = countWords(value)
  const secondsUsed = task.seconds - secondsLeft
  const isEmail = task.type === 'email'

  const editor = (
    <>
      <div className="editor-head">
        <div className="toolbar">
          <button className={`tbtn ${hasSelection && !expired ? 'enabled' : ''}`} disabled={!hasSelection || expired} onClick={doCut}>Cut</button>
          <button className={`tbtn ${clip && !expired ? 'enabled' : ''}`} disabled={!clip || expired} onClick={doPaste}>Paste</button>
          <button className={`tbtn ${past.length && !expired ? 'enabled' : ''}`} disabled={!past.length || expired} onClick={doUndo}>Undo</button>
          <button className={`tbtn ${future.length && !expired ? 'enabled' : ''}`} disabled={!future.length || expired} onClick={doRedo}>Redo</button>
        </div>
        <div className="wordwrap">
          <button className="ghost" onClick={() => setShowWords((v) => !v)}>
            <EyeIcon /> {showWords ? 'Hide' : 'Show'} Word Count
          </button>
          {showWords && <span className="wcount">{wordCount}</span>}
        </div>
      </div>
      <textarea
        ref={taRef}
        className="answer"
        value={value}
        disabled={expired}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        onChange={(e) => applyChange(e.target.value)}
        onSelect={updateSelection}
        onKeyUp={updateSelection}
        onMouseUp={updateSelection}
        onPaste={(e) => {
          e.preventDefault()
          doPaste()
        }}
        onCopy={(e) => {
          e.preventDefault()
          const ta = taRef.current
          if (ta && ta.selectionStart !== ta.selectionEnd) setClip(value.slice(ta.selectionStart, ta.selectionEnd))
        }}
        onCut={(e) => {
          e.preventDefault()
          doCut()
        }}
        onDrop={(e) => e.preventDefault()}
      />
    </>
  )

  return (
    <div className="exam-root">
      <header className="topbar">
        <div className="logo">
          <span className="logo-star">*</span>toefl <span className="logo-ibt">ibt</span><span className="logo-dot">.</span>
        </div>
        <div className="topbar-actions">
          <button className="pill" onClick={() => setShowHelp(true)}>Help <span className="pill-icon">?</span></button>
          <button className="pill" onClick={() => setConfirmNext(true)}>Next <span className="pill-icon">›</span></button>
        </div>
      </header>

      <div className="subbar">
        <div className="crumb">
          <strong>Writing</strong> <span className="crumb-sep">|</span> Question {questionNumber} of {totalQuestions}
        </div>
        <div className="timewrap">
          {showTime && <span className={`time ${secondsLeft <= 60 ? 'time-low' : ''}`}>{fmt(secondsLeft)}</span>}
          <button className="ghost" onClick={() => setShowTime((v) => !v)}>
            <EyeIcon /> {showTime ? 'Hide' : 'Show'} Time
          </button>
        </div>
      </div>

      <main className="content">
        {isEmail ? (
          <>
            <section className="panel left">
              <p className="scenario">{t.scenario}</p>
              <p className="task-intro"><strong>{emailTaskIntro(t)}</strong></p>
              <ul className="bullets">
                {t.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <p className="note">
                Write as much as you can and in complete sentences. <strong>Use your own words.</strong>
              </p>
            </section>
            <section className="panel right">
              <p className="resp-label"><strong>Your Response:</strong></p>
              <p className="mailmeta">
                <strong>To:</strong> {t.recipient}
                <br />
                <strong>Subject:</strong> {t.subject}
              </p>
              {editor}
            </section>
          </>
        ) : (
          <>
            <section className="panel left">
              <p className="scenario">{discussionIntro(t)}</p>
              <p className="task-intro"><strong>In your response, you should do the following.</strong></p>
              <ul className="bullets">
                <li>Express and support your opinion.</li>
                <li>
                  Make a contribution to the discussion <strong>in your own words.</strong>
                </li>
              </ul>
              <p className="note">An effective response will contain at least 100 words.</p>
              <div className="professor">
                <Avatar name={t.professor} size={88} />
                <div className="prof-name">{t.professor}</div>
              </div>
              <p className="prof-question">{t.question}</p>
            </section>
            <section className="panel right">
              {t.students.map((s) => (
                <div className="post" key={s.name}>
                  <div className="post-side">
                    <Avatar name={s.name} size={64} />
                    <div className="post-name">{s.name}</div>
                  </div>
                  <p className="post-text">{s.text}</p>
                </div>
              ))}
              {editor}
            </section>
          </>
        )}
      </main>

      {showHelp && (
        <Modal
          title="Directions"
          actions={<button className="btn primary" onClick={() => setShowHelp(false)}>Return</button>}
        >
          {isEmail ? (
            <p>
              Read the situation on the left, then write your email in the box. Address all three bullet points, use an
              appropriate tone for the recipient, and aim for about 100–120 words. The question ends automatically when
              the timer reaches zero.
            </p>
          ) : (
            <p>
              Read the professor's question and your classmates' posts, then write your own contribution. State your
              opinion clearly, support it with reasons and examples in your own words, and write at least 100 words.
              The question ends automatically when the timer reaches zero.
            </p>
          )}
        </Modal>
      )}

      {confirmNext && (
        <Modal
          title="Are you sure you want to continue?"
          actions={
            <>
              <button className="btn" onClick={() => setConfirmNext(false)}>Return to Question</button>
              <button className="btn primary" onClick={() => onComplete(value, secondsUsed)}>Continue</button>
            </>
          }
        >
          <p>Once you leave this question, you will <strong>not</strong> be able to return to it.</p>
        </Modal>
      )}

      {expired && (
        <Modal
          title="Time has expired"
          actions={<button className="btn primary" onClick={() => onComplete(value, task.seconds)}>Continue</button>}
        >
          <p>Your time for this question has ended. Your response has been saved exactly as it was when the timer reached zero.</p>
        </Modal>
      )}
    </div>
  )
}

function EyeIcon() {
  return (
    <svg className="eye" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path
        d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 11.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9zm0-7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
        fill="currentColor"
      />
    </svg>
  )
}
