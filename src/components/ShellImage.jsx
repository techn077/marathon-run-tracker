import { useState } from 'react'

// Shell images live in /public/shells/<shellname>.webp
// e.g. /public/shells/destroyer.webp
// Falls back to a styled placeholder if the file isn't there yet

export default function ShellImage({ shell, size = 100 }) {
  const [errored, setErrored] = useState(false)

  if (!shell) return null

  const src = `/shells/${shell.toLowerCase().replace(' ', '_')}.webp`

  if (errored) {
    // Placeholder — shows shell initial until image is dropped in
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
          color: 'var(--dim)',
          fontFamily: 'var(--font)',
          lineHeight: 1,
          letterSpacing: 2,
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
      src={src}
      alt={shell}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{
        width: size, height: size, flexShrink: 0,
        objectFit: 'cover',
        border: '1px solid var(--border2)',
        display: 'block',
      }}
    />
  )
}
