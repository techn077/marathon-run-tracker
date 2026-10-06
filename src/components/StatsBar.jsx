const s = {
  bar: { borderBottom: '1px solid var(--border)', flexShrink: 0 },
  // Two-row grid: top = all time, bottom = since reset
  grid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' },
  cell: { padding: '7px 12px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' },
  cellLast: { padding: '7px 12px', borderBottom: '1px solid var(--border)' },
  resetCell: { padding: '7px 12px', borderRight: '1px solid var(--border)' },
  resetCellLast: { padding: '7px 12px' },
  rowLabel: {
    fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
    color: 'var(--dim)', marginBottom: 1,
  },
  statLabel: {
    fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
    color: 'var(--dim)', marginBottom: 2,
  },
}

export default function StatsBar({ stats, isMobile }) {
  const vs  = isMobile ? 20 : 28   // value font size
  const fmt = n => (n >= 0 ? '+' : '') + n
  const netColor = c => c > 0 ? 'var(--pos)' : c < 0 ? 'var(--neg)' : 'var(--white)'

  const COLS = [
    {
      label:       'P&L',
      allVal:      fmt(stats.net),
      allColor:    netColor(stats.net),
      resetVal:    stats.sinceReset !== null ? fmt(stats.sinceReset) : '—',
      resetColor:  stats.sinceReset !== null ? netColor(stats.sinceReset) : 'var(--dim)',
    },
    {
      label:       'Extractions',
      allVal:      stats.extractions,
      allColor:    'var(--pos)',
      resetVal:    stats.sinceResetExtractions !== null ? stats.sinceResetExtractions : '—',
      resetColor:  stats.sinceResetExtractions !== null ? 'var(--pos)' : 'var(--dim)',
    },
    {
      label:       'Deaths',
      allVal:      stats.deaths,
      allColor:    'var(--neg)',
      resetVal:    stats.sinceResetDeaths !== null ? stats.sinceResetDeaths : '—',
      resetColor:  stats.sinceResetDeaths !== null ? 'var(--neg)' : 'var(--dim)',
    },
    {
      label:       isMobile ? 'Rate' : 'Survival %',
      allVal:      stats.rate !== null ? `${stats.rate}%` : '—',
      allColor:    'var(--warn)',
      resetVal:    stats.sinceResetRate !== null ? `${stats.sinceResetRate}%` : '—',
      resetColor:  stats.sinceResetRate !== null ? 'var(--warn)' : 'var(--dim)',
    },
    {
      label:       'Runs',
      allVal:      stats.total,
      allColor:    'var(--white)',
      resetVal:    stats.sinceResetTotal !== null ? stats.sinceResetTotal : '—',
      resetColor:  stats.sinceResetTotal !== null ? 'var(--white)' : 'var(--dim)',
    },
  ]

  return (
    <div style={s.bar}>
      {/* Column headers */}
      <div style={{ ...s.grid, borderBottom: '1px solid var(--border)' }}>
        {COLS.map((col, i) => (
          <div key={col.label} style={{ padding: '4px 12px', borderRight: i < COLS.length-1 ? '1px solid var(--border)' : 'none' }}>
            <div style={s.statLabel}>{col.label}</div>
          </div>
        ))}
      </div>

      {/* All Time row */}
      <div style={s.grid}>
        {COLS.map((col, i) => (
          <div key={col.label} style={i < COLS.length-1 ? s.cell : s.cellLast}>
            <div style={{ ...s.rowLabel, color: 'var(--dim)' }}>All Time</div>
            <div style={{ fontSize: vs, lineHeight: 1, color: col.allColor }}>{col.allVal}</div>
          </div>
        ))}
      </div>

      {/* Since Reset row */}
      <div style={s.grid}>
        {COLS.map((col, i) => (
          <div key={col.label} style={i < COLS.length-1 ? s.resetCell : s.resetCellLast}>
            <div style={{ ...s.rowLabel, color: 'var(--green)', opacity: 0.6 }}>
              {stats.lastResetDate ? `Since ${isMobile ? stats.lastResetDate.slice(5) : stats.lastResetDate}` : 'Since Reset'}
            </div>
            <div style={{ fontSize: vs, lineHeight: 1, color: col.resetColor }}>{col.resetVal}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
