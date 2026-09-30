import { useState, useEffect } from 'react'
import { MAPS, OUTCOMES, SHELLS, TEAM_SIZES, MODES } from '../constants'
import useIsMobile from '../hooks/useIsMobile'

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const base = {
  title: {
    fontSize: 16, letterSpacing: 4, textTransform: 'uppercase',
    color: 'var(--green)', marginBottom: 14, paddingBottom: 6,
    borderBottom: '1px solid var(--border)',
  },
  group: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' },
  input: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)',
    fontFamily: 'var(--font)', fontSize: 18, padding: '8px 12px', outline: 'none',
    width: '100%', borderRadius: 0, appearance: 'none', WebkitAppearance: 'none',
    transition: 'border-color 0.1s',
  },
  textarea: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)',
    fontFamily: 'var(--font)', fontSize: 16, padding: '8px 12px', outline: 'none',
    width: '100%', borderRadius: 0, resize: 'vertical', minHeight: 80, lineHeight: 1.5,
    transition: 'border-color 0.1s',
  },
  hint: { fontSize: 13, color: 'var(--dim)' },
  sep: { height: 1, background: 'var(--border)', margin: '16px 0' },
  actions: { display: 'flex', gap: 8, marginTop: 18 },
  btn: {
    fontFamily: 'var(--font)', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase',
    padding: '7px 16px', background: 'transparent', border: '1px solid var(--border2)',
    color: 'var(--off)', cursor: 'pointer', flex: 1,
  },
}

const selectStyle = {
  ...base.input,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23555'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  paddingRight: 28, cursor: 'pointer',
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        fontSize: 16, letterSpacing: 1, textTransform: 'uppercase',
        color: checked ? 'var(--white)' : 'var(--off)', userSelect: 'none',
      }}
    >
      <div style={{
        width: 16, height: 16, flexShrink: 0,
        background: checked ? 'var(--green)' : 'var(--bg)',
        border: `1px solid ${checked ? 'var(--green)' : 'var(--border2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.1s',
      }}>
        {checked && <span style={{ fontSize: 12, color: 'var(--bg)', lineHeight: 1 }}>✓</span>}
      </div>
      {label}
    </label>
  )
}

const defaultModes = () => Object.fromEntries(MODES.map(m => [m.key, false]))

export default function RunForm({ onSubmit, onCancel, initialValues = null, isEditing = false }) {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({
    date:      initialValues?.date      || localToday(),
    map:       initialValues?.map       || MAPS[0],
    outcome:   initialValues?.outcome   || OUTCOMES[0],
    credits:   initialValues?.credits   !== undefined ? String(initialValues.credits) : '',
    shell:     initialValues?.shell     || '',
    team_size: initialValues?.team_size || '',
    notes:     initialValues?.notes     || '',
    ...defaultModes(),
    // Override defaults with any saved values
    ...Object.fromEntries(MODES.map(m => [m.key, initialValues?.[m.key] || false])),
  })
  const [focused, setFocused] = useState(null)

  // Rook always solo
  useEffect(() => {
    if (form.shell === 'Rook') setForm(f => ({ ...f, team_size: '1' }))
  }, [form.shell])

  const set    = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const toggle = key => () => setForm(f => ({ ...f, [key]: !f[key] }))
  const inp    = key => ({ ...base.input,   borderColor: focused === key ? 'var(--green)' : 'var(--border)' })
  const sel    = key => ({ ...selectStyle,  borderColor: focused === key ? 'var(--green)' : 'var(--border)' })
  const foc    = key => () => setFocused(key)
  const blur   = () => setFocused(null)
  const isRook = form.shell === 'Rook'

  const handleSubmit = () => {
    const modeValues = Object.fromEntries(MODES.map(m => [m.key, form[m.key]]))
    onSubmit({
      date:      form.date,
      map:       form.map,
      outcome:   form.outcome,
      credits:   parseInt(form.credits) || 0,
      shell:     form.shell     || null,
      team_size: form.team_size || null,
      notes:     form.notes.trim() || null,
      ...modeValues,
    })
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? 12 : 14,
  }

  return (
    <div>
      <div style={base.title}>{isEditing ? 'Edit Run' : 'Log New Run'}</div>
      <div style={gridStyle}>

        <div style={base.group}>
          <label style={base.label}>Date</label>
          <input type="date" value={form.date} onChange={set('date')}
            style={inp('date')} onFocus={foc('date')} onBlur={blur} />
        </div>

        <div style={base.group}>
          <label style={base.label}>Map</label>
          <select value={form.map} onChange={set('map')}
            style={sel('map')} onFocus={foc('map')} onBlur={blur}>
            {MAPS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div style={base.group}>
          <label style={base.label}>Outcome</label>
          <select value={form.outcome} onChange={set('outcome')}
            style={sel('outcome')} onFocus={foc('outcome')} onBlur={blur}>
            {OUTCOMES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div style={base.group}>
          <label style={base.label}>Credits</label>
          <input type="number" value={form.credits} onChange={set('credits')}
            placeholder="e.g. 450 or -320"
            style={inp('credits')} onFocus={foc('credits')} onBlur={blur} />
          <span style={base.hint}>+ gained / - lost</span>
        </div>

        <div style={base.group}>
          <label style={base.label}>Runner Shell</label>
          <select value={form.shell} onChange={set('shell')}
            style={sel('shell')} onFocus={foc('shell')} onBlur={blur}>
            <option value="">— Select —</option>
            {SHELLS.map(sh => <option key={sh}>{sh}</option>)}
          </select>
          {isRook && <span style={{ fontSize: 13, color: 'var(--green)', letterSpacing: 1 }}>✓ Rook is always Solo</span>}
        </div>

        <div style={base.group}>
          <label style={base.label}>Team Size</label>
          <select value={form.team_size} onChange={set('team_size')}
            style={{ ...sel('team_size'), opacity: isRook ? 0.4 : 1, pointerEvents: isRook ? 'none' : 'auto' }}
            onFocus={foc('team_size')} onBlur={blur} disabled={isRook}>
            <option value="">— Select —</option>
            {TEAM_SIZES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

      </div>

      {/* Mode checkboxes */}
      <div style={{ marginTop: 14 }}>
        <label style={base.label}>Mode</label>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: isMobile ? '10px 16px' : '10px 24px',
          marginTop: 8, padding: '10px 12px',
          border: '1px solid var(--border)',
        }}>
          {MODES.map(m => (
            <Checkbox key={m.key} checked={form[m.key]} onChange={toggle(m.key)} label={m.label} />
          ))}
        </div>
      </div>

      <div style={base.sep} />
      <div style={base.title}>Field Notes</div>
      <textarea value={form.notes} onChange={set('notes')}
        placeholder="Enemies encountered, events, close calls..."
        style={{ ...base.textarea, borderColor: focused === 'notes' ? 'var(--green)' : 'var(--border)' }}
        onFocus={foc('notes')} onBlur={blur} />

      <div style={base.actions}>
        <button style={{ ...base.btn, borderColor: 'var(--green)', color: 'var(--green)' }}
          onClick={handleSubmit}
          onMouseEnter={e => { e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--green)' }}
        >{isEditing ? 'Save Changes' : 'Submit Run'}</button>
        <button style={base.btn} onClick={onCancel}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--white)'; e.target.style.color = 'var(--white)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--off)' }}
        >Cancel</button>
      </div>
    </div>
  )
}
