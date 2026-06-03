const s = {
  bar: {
    display: 'grid',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  cell: {
    padding: '8px 14px',
    borderRight: '1px solid var(--border)',
  },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'var(--dim)',
    marginBottom: 1,
  },
}

export default function StatsBar({ stats, isMobile }) {
  const netColor = stats.net > 0 ? 'var(--pos)' : stats.net < 0 ? 'var(--neg)' : 'var(--white)'
  const valSize = isMobile ? 26 : 38

  const cells = [
    { label: 'Net P&L',      val: (stats.net >= 0 ? '+' : '') + stats.net, color: netColor },
    { label: 'Extractions',  val: stats.extractions, color: 'var(--pos)' },
    { label: 'Deaths',       val: stats.deaths,      color: 'var(--neg)' },
    { label: isMobile ? 'Rate' : 'Survival Rate', val: stats.rate !== null ? `${stats.rate}%` : '—', color: 'var(--warn)' },
  ]

  return (
    <div style={{ ...s.bar, gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {cells.map((c, i) => (
        <div key={c.label} style={{ ...s.cell, borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
          <div style={s.label}>{c.label}</div>
          <div style={{ fontSize: valSize, lineHeight: 1, color: c.color }}>{c.val}</div>
        </div>
      ))}
    </div>
  )
}
