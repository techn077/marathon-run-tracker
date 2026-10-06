import { useState } from 'react'

// Tries each extension in order until one loads.
// Supported: webp, png, jpg, jpeg
// Files should live in /public/shells/<shellname>.<ext>
// e.g. /public/shells/destroyer.png or /public/shells/destroyer.webp

const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg']

export default function ShellImage({ shell, size = 100 }) {
  const [extIndex, setExtIndex] = useState(0)

  if (!shell) return null

  const base = `/shells/${shell.toLowerCase().replace(' ', '_')}`
  const allExhausted = extIndex >= EXTENSIONS.length

  if (allExhausted) {
    return (
      <div style={{
        width: size, height: size, flexShrink: 0,
        border: '1px solid var(--border2)',
        background: 'var(--surface2)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4,
      }}>
        <div style={{
          fontSize: Math.round(size * 0.38),
          color: 'var(--dim)', fontFamily: 'var(--font)',
          lineHeight: 1, letterSpacing: 2,
        }}>
          {shell[0].toUpperCase()}
        </div>
        <div style={{
          fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
          color: 'var(--dim)', fontFamily: 'var(--font)',
        }}>
          No Image
        </div>
      </div>
    )
  }

  return (
    <img
      key={extIndex}
      src={`${base}.${EXTENSIONS[extIndex]}`}
      alt={shell}
      width={size}
      height={size}
      onError={() => setExtIndex(i => i + 1)}
      style={{
        width: size, height: size, flexShrink: 0,
        objectFit: 'cover',
        border: '1px solid var(--border2)',
        display: 'block',
      }}
    />
  )
}
