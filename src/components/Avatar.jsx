const COLORS = ['#7c4dff', '#00897b', '#e65100', '#3949ab', '#c2185b', '#00838f', '#6d4c41', '#558b2f']

function initialsOf(name) {
  const parts = name.replace(/\./g, '').split(/\s+/).filter((p) => p.toLowerCase() !== 'dr')
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?'
}

function colorOf(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  return COLORS[h % COLORS.length]
}

export default function Avatar({ name, size = 64 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.36, background: colorOf(name) }}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </div>
  )
}
