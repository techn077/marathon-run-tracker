const BADGE_STYLES = {
  Extracted: { background: '#0a1f10', color: 'var(--pos)', outline: '1px solid #2a4a20' },
  Died:      { background: '#1f0a08', color: 'var(--neg)', outline: '1px solid #4a1810' },
  Abandoned: { background: '#1f1a08', color: 'var(--warn)', outline: '1px solid #3f3010' },
}

export default function Badge({ outcome }) {
  return (
    <span style={{
      fontFamily: 'var(--font)',
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      padding: '1px 5px',
      ...(BADGE_STYLES[outcome] || {}),
    }}>
      {outcome}
    </span>
  )
}
