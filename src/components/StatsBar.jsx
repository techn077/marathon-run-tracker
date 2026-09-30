const s = {
  bar: { borderBottom: '1px solid var(--border)', flexShrink: 0 },
  topRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--border)' },
  pnlRow: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
  cell: { padding: '8px 14px', borderRight: '1px solid var(--border)' },
  label: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 1 },
  sublabel: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 1 },
}

export default function StatsBar({ stats, isMobile }) {
  const valSize = isMobile ? 24 : 36
  const pnlSize = isMobile ? 22 : 32

  const netColor  = c => c > 0 ? 'var(--pos)' : c < 0 ? 'var(--neg)' : 'var(--white)'
  const fmt       = n => (n >= 0 ? '+' : '') + n

  return (
    <div style={s.bar}>
      {/* Top row: Extractions, Deaths, Survival Rate, (spacer) */}
      <div style={s.topRow}>
        <div style={s.cell}>
          <div style={s.label}>Extractions</div>
          <div style={{ fontSize: valSize, lineHeight: 1, color: 'var(--pos)' }}>{stats.extractions}</div>
        </div>
        <div style={s.cell}>
          <div style={s.label}>Deaths</div>
          <div style={{ fontSize: valSize, lineHeight: 1, color: 'var(--neg)' }}>{stats.deaths}</div>
        </div>
        <div style={s.cell}>
          <div style={s.label}>{isMobile ? 'Rate' : 'Survival Rate'}</div>
          <div style={{ fontSize: valSize, lineHeight: 1, color: 'var(--warn)' }}>
            {stats.rate !== null ? `${stats.rate}%` : '—'}
          </div>
        </div>
        <div style={{ ...s.cell, borderRight: 'none' }}>
          <div style={s.label}>Runs</div>
          <div style={{ fontSize: valSize, lineHeight: 1, color: 'var(--white)' }}>{stats.total}</div>
        </div>
      </div>

      {/* P&L row: All Time | Since Reset */}
      <div style={s.pnlRow}>
        <div style={{ ...s.cell, borderRight: '1px solid var(--border)' }}>
          <div style={s.sublabel}>All Time P&L</div>
          <div style={{ fontSize: pnlSize, lineHeight: 1, color: netColor(stats.net) }}>
            {fmt(stats.net)}
          </div>
        </div>
        <div style={{ ...s.cell, borderRight: 'none' }}>
          <div style={s.sublabel}>
            Since Reset {stats.lastResetDate ? `(${stats.lastResetDate})` : ''}
          </div>
          <div style={{ fontSize: pnlSize, lineHeight: 1, color: stats.sinceReset !== null ? netColor(stats.sinceReset) : 'var(--dim)' }}>
            {stats.sinceReset !== null ? fmt(stats.sinceReset) : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}
