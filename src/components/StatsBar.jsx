const s = {
  bar: { borderBottom: '1px solid var(--border)', flexShrink: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' },
  cell: {
    padding: '8px 12px',
    borderRight: '1px solid var(--border)',
  },
  cellLast: {
    padding: '8px 12px',
  },
  statLabel: {
    fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
    color: 'var(--dim)', marginBottom: 4,
  },
  subLabel: {
    fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
    color: 'var(--green)', opacity: 0.55, marginTop: 5, marginBottom: 2,
  },
  divider: {
    height: 1, background: 'var(--border)', margin: '5px 0',
  },
}

export default function StatsBar({ stats, isMobile }) {
  const vs  = isMobile ? 18 : 24
  const rvs = isMobile ? 15 : 20
  const fmt = n => (n >= 0 ? '+' : '') + n
  const netColor = c => c > 0 ? 'var(--pos)' : c < 0 ? 'var(--neg)' : 'var(--white)'

  const COLS = [
    {
      label:      'P&L',
      allVal:     fmt(stats.net),
      allColor:   netColor(stats.net),
      resetVal:   stats.sinceReset !== null ? fmt(stats.sinceReset) : '—',
      resetColor: stats.sinceReset !== null ? netColor(stats.sinceReset) : 'var(--dim)',
    },
    {
      label:      'Extractions',
      allVal:     stats.extractions,
      allColor:   'var(--pos)',
      resetVal:   stats.sinceResetExtractions !== null ? stats.sinceResetExtractions : '—',
      resetColor: stats.sinceResetExtractions !== null ? 'var(--pos)' : 'var(--dim)',
    },
    {
      label:      'Deaths',
      allVal:     stats.deaths,
      allColor:   'var(--neg)',
      resetVal:   stats.sinceResetDeaths !== null ? stats.sinceResetDeaths : '—',
      resetColor: stats.sinceResetDeaths !== null ? 'var(--neg)' : 'var(--dim)',
    },
    {
      label:      isMobile ? 'Rate' : 'Survival %',
      allVal:     stats.rate !== null ? `${stats.rate}%` : '—',
      allColor:   'var(--warn)',
      resetVal:   stats.sinceResetRate !== null ? `${stats.sinceResetRate}%` : '—',
      resetColor: stats.sinceResetRate !== null ? 'var(--warn)' : 'var(--dim)',
    },
    {
      label:      'Runs',
      allVal:     stats.total,
      allColor:   'var(--white)',
      resetVal:   stats.sinceResetTotal !== null ? stats.sinceResetTotal : '—',
      resetColor: stats.sinceResetTotal !== null ? 'var(--white)' : 'var(--dim)',
    },
  ]

  return (
    <div style={s.bar}>
      <div style={s.grid}>
        {COLS.map((col, i) => (
          <div key={col.label} style={i < COLS.length - 1 ? s.cell : s.cellLast}>

            {/* Stat name */}
            <div style={s.statLabel}>{col.label}</div>

            {/* All time value */}
            <div style={{ fontSize: vs, lineHeight: 1, color: col.allColor }}>
              {col.allVal}
            </div>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--dim)', marginTop: 2 }}>
              All Time
            </div>

            {/* Divider */}
            <div style={s.divider} />

            {/* Since Last Reset value */}
            <div style={{ fontSize: rvs, lineHeight: 1, color: col.resetColor }}>
              {col.resetVal}
            </div>
            <div style={s.subLabel}>Since Last Reset</div>

          </div>
        ))}
      </div>
    </div>
  )
}
