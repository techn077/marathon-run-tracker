import Badge from './Badge'

const s = {
  card: {
    border: '1px solid var(--border)',
    padding: '16px 18px',
    marginBottom: 14,
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 12,
    alignItems: 'start',
  },
  map: { fontSize: 28, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--white)', marginBottom: 8 },
  meta: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  metaItem: { fontSize: 15, color: 'var(--dim)', letterSpacing: 0.5 },
  pnl: { fontSize: 48, textAlign: 'right', lineHeight: 1, marginBottom: 8 },
  delBtn: {
    fontFamily: 'var(--font)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid #2a1510', color: 'var(--neg)',
    padding: '3px 10px', cursor: 'pointer', opacity: 0.4, transition: 'opacity 0.12s',
  },
  kvRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
  kv: { border: '1px solid var(--border)', padding: '10px 14px' },
  kvLabel: { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 4 },
  kvVal: { fontSize: 22, color: 'var(--white)' },
  notesBlock: { border: '1px solid var(--border)', padding: '12px 16px', marginTop: 10 },
  notesLabel: { fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 },
  notesText: { fontSize: 16, color: 'var(--off)', lineHeight: 1.6 },
}

const teamLabel = (ts) => {
  if (ts === '3') return '3 — Trio'
  if (ts === '2') return '2 — Duo'
  if (ts === '1') return '1 — Solo'
  return ts || '—'
}

export default function RunDetail({ run, onDelete }) {
  const credits = run.credits || 0
  const pnlColor = credits >= 0 ? 'var(--pos)' : 'var(--neg)'

  return (
    <div>
      <div style={s.card}>
        <div>
          <div style={s.map}>{run.map}</div>
          <div style={s.meta}>
            <Badge outcome={run.outcome} />
            <span style={s.metaItem}>{run.date}</span>
            {run.runner && <span style={s.metaItem}>// {run.runner}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...s.pnl, color: pnlColor }}>
            {credits >= 0 ? '+' : ''}{credits}
          </div>
          <button
            style={s.delBtn}
            onClick={() => onDelete(run.id)}
            onMouseEnter={e => { e.target.style.opacity = 1 }}
            onMouseLeave={e => { e.target.style.opacity = 0.4 }}
          >
            Delete Run
          </button>
        </div>
      </div>

      <div style={s.kvRow}>
        <div style={s.kv}>
          <div style={s.kvLabel}>Runner Shell</div>
          <div style={s.kvVal}>{run.shell || '—'}</div>
        </div>
        <div style={s.kv}>
          <div style={s.kvLabel}>Team Size</div>
          <div style={s.kvVal}>{teamLabel(run.team_size)}</div>
        </div>
      </div>

      {run.notes && (
        <div style={s.notesBlock}>
          <div style={s.notesLabel}>Field Notes</div>
          <div style={s.notesText}>{run.notes}</div>
        </div>
      )}
    </div>
  )
}
