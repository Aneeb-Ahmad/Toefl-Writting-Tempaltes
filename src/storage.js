const doneKey = (type) => `toefl.done.${type}`

export function getDone(type) {
  try {
    return JSON.parse(localStorage.getItem(doneKey(type))) || []
  } catch {
    return []
  }
}

export function markDone(type, id) {
  try {
    const done = getDone(type)
    if (!done.includes(id)) {
      done.push(id)
      localStorage.setItem(doneKey(type), JSON.stringify(done))
    }
  } catch {
    /* private mode etc. — practice still works */
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(doneKey('email'))
    localStorage.removeItem(doneKey('discussion'))
    localStorage.removeItem(doneKey('reading'))
  } catch {}
}

// Prefer a template the user has not practiced yet; when all are done, pick any.
export function pickTemplate(type, list) {
  const done = getDone(type)
  const unused = list.filter((t) => !done.includes(t.id))
  const pool = unused.length > 0 ? unused : list
  return pool[Math.floor(Math.random() * pool.length)]
}
