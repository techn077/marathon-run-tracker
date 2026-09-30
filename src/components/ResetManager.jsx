import { useState } from 'react'
import { supabase } from '../supabase'

const s = {
  wrap: { marginTop: 0 },
  title: {
    fontSize: 16, letterSpacing: 4, textTransform: 'uppercase',
    color: 'var(--green)', marginBottom: 14, paddingBottom: 6,
    borderBottom: '1px solid var(--border)',
  },
  addRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  input: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)',
    fontFamily: 'var(--font)', fontSize: 16, padding: '6px 10px', outline: 'none',
    borderRadius: 0, transition: 'border-color 0.1s', flex: 1, minWidth: 120,
  },
  addBtn: {
    fontFamily: 'var(--font)', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase',
    padding: '6px 16px', background: 'transparent', border: '1px solid var(--green)',
    color: 'var(--green)', cursor: 'pointer', transition: 'all 0.1s', whiteSpace: 'nowrap',
  },
  empty: { fontSize: 15, color: 'var(--dim)', letterSpacing: 1, textTransform: 'uppercase', padding: '12px 0' },
  resetItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', border: '1px solid var(--border)', marginBottom: 6,
    gap: 12,
  },
  resetLeft: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  resetDate: { fontSize: 18, color: 'var(--green)', letterSpacing: 1, flexShrink: 0 },
  resetLabel: { fontSize: 16, color: 'var(--white)', letterSpacing: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  futureBadge: {
    fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
    border: '1px solid var(--warn)', color: 'var(--warn)', padding: '1px 5px', flexShrink: 0,
  },
  delBtn: {
    fontFamily: 'var(--font)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid #2a1510', color: 'var(--neg)',
    padding: '3px 8px', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.1s', flexShrink: 0,
  },
  hint: { fontSize: 13, color: 'var(--dim)', letterSpacing: 0.5, marginTop: 10 },
}

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function ResetManager({ resets, onResetsChange, userId }) {
  const [label, setLabel] = useState('')
  const [date, setDate]   = useState(localToday())
  const [saving, setSaving] = useState(false)
  const [focused, setFocused] = useState(null)

  const today = localToday()

  const handleAdd = async () => {
    if (!label.trim() || !date) return
    setSaving(true)
    const { data, error } = await supabase
      .from('resets')
      .insert([{ label: label.trim(), reset_date: date, user_id: userId }])
      .select()
      .single()
    if (error) { alert('Error saving reset: ' + error.message); setSaving(false); return }
    onResetsChange([...resets, data].sort((a,b) => a.reset_date.localeCompare(b.reset_date)))
    setLabel('')
    setDate(localToday())
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reset marker?')) return
    const { error } = await supabase.from('resets').delete().eq('id', id)
    if (error) { alert('Error deleting reset: ' + error.message); return }
    onResetsChange(resets.filter(r => r.id !== id))
  }

  const sorted = [...resets].sort((a,b) => a.reset_date.localeCompare(b.reset_date))

  return (
    <div style={s.wrap}>
      <div style={s.title}>Season Resets</div>

      <div style={s.addRow}>
        <input
          style={{ ...s.input, flex: '2 1 160px', borderColor: focused === 'label' ? 'var(--green)' : 'var(--border)' }}
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label (e.g. Season 1 End)"
          onFocus={() => setFocused('label')}
          onBlur={() => setFocused(null)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <input
          type="date"
          style={{ ...s.input, flex: '1 1 130px', borderColor: focused === 'date' ? 'var(--green)' : 'var(--border)' }}
          value={date}
          onChange={e => setDate(e.target.value)}
          onFocus={() => setFocused('date')}
          onBlur={() => setFocused(null)}
        />
        <button
          style={s.addBtn}
          onClick={handleAdd}
          disabled={saving || !label.trim()}
          onMouseEnter={e => { e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--green)' }}
        >
          {saving ? '...' : '+ Add'}
        </button>
      </div>

      {sorted.length === 0 ? (
        <div style={s.empty}>No resets defined yet</div>
      ) : (
        sorted.map(r => {
          const isFuture = r.reset_date > today
          return (
            <div key={r.id} style={s.resetItem}>
              <div style={s.resetLeft}>
                <span style={s.resetDate}>{r.reset_date}</span>
                <span style={s.resetLabel}>{r.label}</span>
                {isFuture && <span style={s.futureBadge}>Future</span>}
              </div>
              <button
                style={s.delBtn}
                onClick={() => handleDelete(r.id)}
                onMouseEnter={e => { e.target.style.opacity = 1 }}
                onMouseLeave={e => { e.target.style.opacity = 0.5 }}
              >Delete</button>
            </div>
          )
        })
      )}
      <div style={s.hint}>Future reset dates will appear on the chart once that date is reached.</div>
    </div>
  )
}
