import { useState } from 'react'
import Badge from './Badge'
import RunForm from './RunForm'

const s = {
  card: {
    border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 14,
    display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start',
  },
  map: { fontSize: 28, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--white)', marginBottom: 6 },
  meta: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 },
  metaItem: { fontSize: 15, color: 'var(--dim)', letterSpacing: 0.5 },
  modeBadge: {
    fontFamily: 'var(--font)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
    padding: '2px 6px', border: '1px solid var(--border2)', color: 'var(--off)',
  },
  modeBadgeActive: {
    fontFamily: 'var(--font)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
    padding: '2px 6px', border: '1px solid var(--green)', color: 'var(--green)',
    background: 'rgba(200,255,0,0.06)',
  },
  pnl: { fontSize: 48, textAlign: 'right', lineHeight: 1, marginBottom: 12 },
  kvRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
  kv: { border: '1px solid var(--border)', padding: '10px 14px' },
  kvLabel: { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 4 },
  kvVal: { fontSize: 22, color: 'var(--white)' },
  notesBlock: { border: '1px solid var(--border)', padding: '12px 16px', marginTop: 10 },
  notesLabel: { fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 },
  notesText: { fontSize: 16, color: 'var(--off)', lineHeight: 1.6 },
  actionsRow: { display: 'flex', gap: 8, marginTop: 20 },
  editBtn: {
    fontFamily: 'var(--font)', fontSize: 18, letterSpacing: 2, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)',
    padding: '7px 0', cursor: 'pointer', transition: 'all 0.15s', flex: 1,
  },
  deleteSection: { marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 },
  deleteLabel: { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 10 },
  delBtn: {
    fontFamily: 'var(--font)', fontSize: 18, letterSpacing: 2, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid var(--neg)', color: 'var(--neg)',
    padding: '7px 20px', cursor: 'pointer', transition: 'all 0.15s', display: 'block', width: '100%',
  },
  delBtnConfirm: {
    fontFamily: 'var(--font)', fontSize: 18, letterSpacing: 2, textTransform: 'uppercase',
    background: 'var(--neg)', border: '1px solid var(--neg)', color: '#000',
    padding: '7px 20px', cursor: 'pointer', transition: 'all 0.15s', display: 'block', width: '100%',
  },
  cancelBtn: {
    fontFamily: 'var(--font)', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid var(--border2)', color: 'var(--dim)',
    padding: '5px 16px', cursor: 'pointer', transition: 'all 0.15s', marginTop: 8,
    display: 'block', width: '100%',
  },
  confirmMsg: { fontSize: 16, color: 'var(--neg)', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' },
}

const teamLabel = (ts) => {
  if (ts === '3') return '3 — Trio'
  if (ts === '2') return '2 — Duo'
  if (ts === '1') return '1 — Solo'
  return ts || '—'
}

export default function RunDetail({ run, onDelete, onEdit }) {
  const [confirming, setConfirming] = useState(false)
  const [editing, setEditing] = useState(false)
  const credits = run.credits || 0
  const pnlColor = credits >= 0 ? 'var(--pos)' : 'var(--neg)'

  if (editing) {
    return (
      <RunForm
        initialValues={run}
        onSubmit={(data) => { onEdit(run.id, data); setEditing(false) }}
        onCancel={() => setEditing(false)}
        isEditing
      />
    )
  }

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
          {/* Mode badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={run.experimental ? s.modeBadgeActive : s.modeBadge}>
              Experimental
            </span>
            <span style={run.ranked ? s.modeBadgeActive : s.modeBadge}>
              Ranked
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...s.pnl, color: pnlColor }}>{credits >= 0 ? '+' : ''}{credits}</div>
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

      <div style={s.actionsRow}>
        <button style={s.editBtn} onClick={() => setEditing(true)}
          onMouseEnter={e => { e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--green)' }}
        >✎ Edit Run</button>
      </div>

      <div style={s.deleteSection}>
        <div style={s.deleteLabel}>Danger Zone</div>
        {!confirming ? (
          <button style={s.delBtn} onClick={() => setConfirming(true)}
            onMouseEnter={e => { e.target.style.background = '#1f0a08' }}
            onMouseLeave={e => { e.target.style.background = 'transparent' }}
          >⚠ Delete This Run</button>
        ) : (
          <>
            <div style={s.confirmMsg}>Are you sure? This cannot be undone.</div>
            <button style={s.delBtnConfirm} onClick={() => onDelete(run.id)}>Yes, Delete It</button>
            <button style={s.cancelBtn} onClick={() => setConfirming(false)}
              onMouseEnter={e => { e.target.style.color = 'var(--white)'; e.target.style.borderColor = 'var(--white)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--dim)'; e.target.style.borderColor = 'var(--border2)' }}
            >Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}
