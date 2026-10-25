import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../Modal'
import { parseCtw } from '../../reading/ctw'
import { buildModule, routeFor } from '../../reading/bank'
import { moduleItems } from '../../reading/rules'
import { READING_SECONDS_PER_ITEM } from '../../config'

const pad = (n) => String(n).padStart(2, '0')
const fmt = (sec) => `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`

// One screen per Complete the Words paragraph, one per multiple-choice question (the text stays on screen).
function buildScreens(module) {
  const screens = []
  let n = 1
  for (const set of module.sets) {
    if (set.type === 'ctw') {
      screens.push({ set, first: n, last: n + set.answers.length - 1 })
      n += set.answers.length
    } else {
      set.questions.forEach((q, qi) => screens.push({ set, qi, first: n, last: n++ }))
    }
  }
  return screens
}

// mode 'full': Module 1 routes to Module 2, like the real section. mode 'module': one module only.
export default function ReadingExam({ mode = 'full', onFinish, onHome }) {
  const single = mode === 'module'
  const [phase, setPhase] = useState('intro1')
  const [modules, setModules] = useState(() => [buildModule()])
  const [route, setRoute] = useState(null)
  const [responses, setResponses] = useState({})

  const setAnswer = (key, value) => setResponses((r) => ({ ...r, [key]: value }))

  function endModule1() {
    if (single) return onFinish([modules[0]], responses, null)
    const items = moduleItems(modules[0], responses)
    const r = routeFor(items.filter((i) => i.correct).length, items.length)
    setRoute(r)
    setModules([modules[0], buildModule(modules[0].sets.map((s) => s.id))])
    setPhase('intro2')
  }

  if (!modules[0].sets.length) {
    return (
      <Shell onHome={onHome}>
        <main className="r-intro">
          <div className="r-intro-card">
            <h2>No reading sets yet</h2>
            <p>The official ETS practice tests load automatically when the app starts with an internet connection. Restart the app while online.</p>
            <button className="btn primary" onClick={onHome}>Back to Home</button>
          </div>
        </main>
      </Shell>
    )
  }

  if (phase === 'intro1' || phase === 'intro2') {
    const no = phase === 'intro1' ? 1 : 2
    const mod = modules[no - 1]
    return (
      <Shell>
        <main className="r-intro">
          <div className="r-intro-card">
            <div className="card-tag">{single ? 'SINGLE MODULE PRACTICE' : 'READING SECTION'}</div>
            <h2>{single ? 'Reading Module' : `Module ${no}`}</h2>
            <ul className="bullets">
              <li>{mod.items} questions. You have <strong>{Math.round((mod.items * READING_SECONDS_PER_ITEM) / 60)} minutes</strong> — the clock shows the time left for this module.</li>
              <li>Use <strong>Next</strong> and <strong>Back</strong> to move between questions in this module.</li>
              {single ? (
                <li>Your results appear when you finish this module.</li>
              ) : no === 1 ? (
                <li>Once you begin Module 2, you <strong>cannot return</strong> to Module 1.</li>
              ) : (
                <li>Module 2 depends on how you did in Module 1.</li>
              )}
            </ul>
            <button className="btn primary big" onClick={() => setPhase(no === 1 ? 'm1' : 'm2')}>Begin</button>
          </div>
        </main>
      </Shell>
    )
  }

  const no = phase === 'm1' ? 1 : 2
  return (
    <ModuleRunner
      key={phase}
      moduleNo={no}
      last={single || no === 2}
      module={modules[no - 1]}
      responses={responses}
      setAnswer={setAnswer}
      onDone={() => (no === 1 ? endModule1() : onFinish(modules, responses, route))}
    />
  )
}

function Shell({ children, right }) {
  return (
    <div className="exam-root">
      <header className="topbar">
        <div className="logo">
          <span className="logo-star">*</span>toefl <span className="logo-ibt">ibt</span><span className="logo-dot">.</span>
        </div>
        {right}
      </header>
      {children}
    </div>
  )
}

function ModuleRunner({ moduleNo, last, module, responses, setAnswer, onDone }) {
  const screens = useMemo(() => buildScreens(module), [module])
  const seconds = module.items * READING_SECONDS_PER_ITEM
  const [idx, setIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(seconds)
  const [showTime, setShowTime] = useState(true)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const expired = secondsLeft <= 0

  useEffect(() => {
    if (expired) return
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, expired])

  const screen = screens[idx]
  const { set } = screen
  const label = screen.first === screen.last ? `Question ${screen.first}` : `Questions ${screen.first}–${screen.last}`

  return (
    <Shell
      right={
        <div className="topbar-actions">
          <button className="pill" onClick={() => setShowHelp(true)}>Help <span className="pill-icon">?</span></button>
          <button className="pill" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><span className="pill-icon">‹</span> Back</button>
          <button className="pill" onClick={() => (idx + 1 < screens.length ? setIdx(idx + 1) : setConfirmEnd(true))}>
            Next <span className="pill-icon">›</span>
          </button>
        </div>
      }
    >
      <div className="subbar">
        <div className="crumb">
          <strong>Reading</strong>
          {!(last && moduleNo === 1) && <><span className="crumb-sep">|</span> Module {moduleNo}</>}
          <span className="crumb-sep">|</span> {label} of {module.items}
        </div>
        <div className="timewrap">
          {showTime && <span className={`time ${secondsLeft <= 60 ? 'time-low' : ''}`}>{fmt(Math.max(0, secondsLeft))}</span>}
          <button className="ghost" onClick={() => setShowTime((v) => !v)}>
            <EyeIcon /> {showTime ? 'Hide' : 'Show'} Time
          </button>
        </div>
      </div>

      {set.type === 'ctw' ? (
        <main className="content r-single">
          <CtwTask set={set} responses={responses} setAnswer={setAnswer} disabled={expired} />
        </main>
      ) : (
        <main className="content">
          <section className="panel left r-text">
            {set.type === 'daily' ? (
              <DailyText set={set} highlight={quoted(set.questions[screen.qi].prompt)} />
            ) : (
              <Passage
                set={set}
                question={set.questions[screen.qi]}
                value={responses[`${set.id}:q${screen.qi}`]}
                onPick={(v) => setAnswer(`${set.id}:q${screen.qi}`, v)}
                disabled={expired}
              />
            )}
          </section>
          <section className="panel right">
            <Question
              q={set.questions[screen.qi]}
              value={responses[`${set.id}:q${screen.qi}`]}
              onPick={(v) => setAnswer(`${set.id}:q${screen.qi}`, v)}
              disabled={expired}
            />
          </section>
        </main>
      )}

      {showHelp && (
        <Modal title="Directions" actions={<button className="btn primary" onClick={() => setShowHelp(false)}>Return</button>}>
          {set.type === 'ctw' && <p>Type the missing letters of each incomplete word. Each box holds one letter; the cursor moves to the next box as you type. Each completed word is worth one point.</p>}
          {set.type === 'daily' && <p>Read the everyday text on the left and choose the best answer to the question. The text stays on screen for every question about it.</p>}
          {set.type === 'academic' && <p>Read the passage on the left and choose the best answer. For "Where would the sentence best fit?", click one of the squares in the passage.</p>}
          <p>Use Back and Next to move within this module. When the clock reaches zero, the module ends.</p>
        </Modal>
      )}

      {confirmEnd && (
        <Modal
          title={last ? 'Finish and see your results?' : 'End Module 1?'}
          actions={
            <>
              <button className="btn" onClick={() => setConfirmEnd(false)}>Return</button>
              <button className="btn primary" onClick={onDone}>Continue</button>
            </>
          }
        >
          <p>
            {last
              ? <>You will <strong>not</strong> be able to change your answers after you continue.</>
              : <>Once you begin Module 2, you will <strong>not</strong> be able to return to Module 1.</>}
          </p>
        </Modal>
      )}

      {expired && (
        <Modal title="Time has expired" actions={<button className="btn primary" onClick={onDone}>Continue</button>}>
          <p>Your time for Module {moduleNo} has ended. Your answers were saved as they were when the clock reached zero.</p>
        </Modal>
      )}
    </Shell>
  )
}

// ---------- Complete the Words ----------

function CtwTask({ set, responses, setAnswer, disabled }) {
  const { segments } = useMemo(() => parseCtw(set.paragraph, set.answers), [set])
  const boxes = useRef([])
  const order = []
  segments.forEach((s) => s.type === 'blank' && [...s.answer].forEach((_, li) => order.push(`${s.index}-${li}`)))
  const focusAt = (pos) => boxes.current[order[pos]]?.focus()

  function letters(seg) {
    const v = responses[`${set.id}:b${seg.index}`] ?? ''
    return [...seg.answer].map((_, i) => (v[i] && v[i] !== ' ' ? v[i] : ''))
  }
  function put(seg, li, ch) {
    const arr = letters(seg)
    arr[li] = ch
    setAnswer(`${set.id}:b${seg.index}`, arr.map((c) => c || ' ').join('').replace(/\s+$/, ''))
  }

  function onKey(e, seg, li) {
    const pos = order.indexOf(`${seg.index}-${li}`)
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (letters(seg)[li]) put(seg, li, '')
      else if (pos > 0) {
        const [bi, bli] = order[pos - 1].split('-').map(Number)
        put(segments.find((s) => s.type === 'blank' && s.index === bi), bli, '')
        focusAt(pos - 1)
      }
    } else if (e.key === 'ArrowLeft') focusAt(pos - 1)
    else if (e.key === 'ArrowRight') focusAt(pos + 1)
    else if (/^[a-zA-Z'’-]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      put(seg, li, e.key)
      focusAt(pos + 1)
    }
  }

  return (
    <div className="ctw">
      <p className="r-direction">Fill in the missing letters in the paragraph.</p>
      <p className="ctw-para">
        {segments.map((seg, i) =>
          seg.type === 'text' ? (
            <span key={i}>{seg.text}</span>
          ) : (
            <span key={i} className="ctw-word">
              {seg.stem}
              {letters(seg).map((ch, li) => (
                <input
                  key={li}
                  ref={(el) => (boxes.current[`${seg.index}-${li}`] = el)}
                  className="ctw-box"
                  value={ch}
                  disabled={disabled}
                  maxLength={2}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label={`Word ${seg.index + 1}, letter ${li + 1}`}
                  onKeyDown={(e) => onKey(e, seg, li)}
                  onChange={(e) => {
                    // mobile keyboards don't always send keydown with a key value
                    const ch2 = e.target.value.replace(ch, '').slice(-1)
                    if (/^[a-zA-Z'’-]$/.test(ch2)) {
                      put(seg, li, ch2)
                      focusAt(order.indexOf(`${seg.index}-${li}`) + 1)
                    }
                  }}
                />
              ))}
            </span>
          ),
        )}
      </p>
    </div>
  )
}

// ---------- Read in Daily Life ----------

const quoted = (prompt) => prompt.match(/[“"]([^”"]{3,})[”"]/)?.[1] ?? ''

function withHighlight(text, phrase) {
  if (!phrase) return text
  const at = text.toLowerCase().indexOf(phrase.toLowerCase())
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <mark className="r-mark">{text.slice(at, at + phrase.length)}</mark>
      {text.slice(at + phrase.length)}
    </>
  )
}

const CHAT_RE = /^\**\s*([^*()]+?)\s*\((\d{1,2}:\d{2}\s*[AP]\.?M\.?)\)\**\s*(.*)$/i

function DailyText({ set, highlight }) {
  const lines = set.text.split('\n')
  const isChat = lines.some((l) => CHAT_RE.test(l))
  return (
    <>
      <p className="r-direction">Read {/^[aeiou]/i.test(set.genre) ? 'an' : 'a'} {set.genre}.</p>
      <div className={`daily-card ${isChat ? 'chat' : set.genre.includes('email') ? 'email' : 'notice'}`}>
        {lines.map((line, i) => {
          const chat = line.match(CHAT_RE)
          if (chat) {
            return (
              <div className="bubble" key={i}>
                <div className="bubble-head"><strong>{chat[1]}</strong> <span>{chat[2]}</span></div>
                <div>{withHighlight(chat[3].replace(/\*\*/g, ''), highlight)}</div>
              </div>
            )
          }
          const subject = line.match(/^Subject:\s*(.*)$/)
          if (subject) return <p className="email-subject" key={i}><strong>Subject:</strong> {subject[1]}</p>
          return <p key={i}>{withHighlight(line, highlight)}</p>
        })}
      </div>
    </>
  )
}

// ---------- Read an Academic Passage ----------

function Passage({ set, question, value, onPick, disabled }) {
  const phrase = quoted(question.prompt)
  const insert = Boolean(question.insertSentence)
  return (
    <>
      <h3 className="passage-title">{set.title}</h3>
      {set.passage.split('\n').map((para, pi) => (
        <p className="passage-para" key={pi}>
          {para.split(/\s*\(([A-D])\)\s*/).map((part, i) => {
            if (i % 2 === 0) return <span key={i}>{withHighlight(part, phrase)}{part && ' '}</span>
            if (!insert) return null
            const opt = 'ABCD'.indexOf(part)
            return value === opt ? (
              <span
                key={i}
                role="button"
                tabIndex={0}
                className="insert-done"
                title="Click to remove"
                onClick={() => !disabled && onPick(undefined)}
                onKeyDown={(e) => e.key === 'Enter' && !disabled && onPick(undefined)}
              >
                {question.insertSentence}
              </span>
            ) : (
              <button key={i} className="insert-square" disabled={disabled} aria-label={`Insert at ${part}`} onClick={() => onPick(opt)}>■</button>
            )
          })}
        </p>
      ))}
    </>
  )
}

function Question({ q, value, onPick, disabled }) {
  return (
    <div className="r-question">
      {q.insertSentence ? (
        <>
          <p>Look at the four squares <span className="insert-square static">■</span> in the passage. They show where the following sentence could be added.</p>
          <p className="insert-sentence">{q.insertSentence}</p>
          <p className="r-prompt">Where would the sentence best fit? Click a square to add the sentence to the passage.</p>
        </>
      ) : (
        <p className="r-prompt">{q.prompt}</p>
      )}
      <div className="r-options" role="radiogroup">
        {q.options.map((opt, i) => (
          <button
            key={i}
            role="radio"
            aria-checked={value === i}
            className={`r-option ${value === i ? 'on' : ''}`}
            disabled={disabled}
            onClick={() => onPick(i)}
          >
            <span className="r-oval" />
            <span>{opt}</span>
          </button>
        ))}
      </div>
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
