import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Label,
} from 'recharts'
import Badge from './Badge'
import { MAPS, SHELLS, OUTCOMES, MODES } from '../constants'
import useIsMobile from '../hooks/useIsMobile'

const s = {
  title: {
    fontSize: 16, letterSpacing: 4, textTransform: 'uppercase',
    color: 'var(--green)', marginBottom: 14, paddingBottom: 6,
    borderBottom: '1px solid var(--border)',
  },
  filtersRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110, flex: 1 },
  filterLabel: { fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' },
  select: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)',
    fontFamily: 'var(--font)', fontSize: 16, padding: '5px 28px 5px 8px', outline: 'none',
    width: '100%', borderRadius: 0, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23555'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
    transition: 'border-color 0.1s',
  },
  input: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)',
    fontFamily: 'var(--font)', fontSize: 16, padding: '5px 8px', outline: 'none',
    width: '100%', borderRadius: 0, transition: 'border-color 0.1s',
    colorScheme: 'dark',
  },
  clearBtn: {
    fontFamily: 'var(--font)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid var(--border2)', color: 'var(--dim)',
    padding: '4px 10px', cursor: 'pointer', alignSelf: 'flex-end', whiteSpace: 'nowrap',
  },
  modeToggle: {
    fontFamily: 'var(--font)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
    padding: '4px 10px', cursor: 'pointer', transition: 'all 0.1s',
    border: '1px solid var(--border2)', background: 'transparent', color: 'var(--dim)', whiteSpace: 'nowrap',
  },
  modeToggleActive: {
    fontFamily: 'var(--font)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
    padding: '4px 10px', cursor: 'pointer', transition: 'all 0.1s',
    border: '1px solid var(--green)', background: 'rgba(200,255,0,0.08)', color: 'var(--green)', whiteSpace: 'nowrap',
  },
  filterCount: { fontSize: 14, color: 'var(--dim)', letterSpacing: 1, marginBottom: 12 },
  legend: { display: 'flex', gap: 18, marginBottom: 16, marginTop: 4, flexWrap: 'wrap' },
  legendItem: { fontSize: 15, letterSpacing: 2, textTransform: 'uppercase' },
  sep: { height: 1, background: 'var(--border)', margin: '16px 0' },
  tbl: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', textAlign: 'left', padding: '7px 8px', borderBottom: '1px solid var(--border)' },
  td: { fontSize: 13, padding: '7px 8px', borderBottom: '1px solid #111', color: 'var(--off)' },
  backBtn: {
    fontFamily: 'var(--font)', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase',
    padding: '5px 16px', background: 'transparent', border: '1px solid var(--border2)',
    color: 'var(--off)', cursor: 'pointer', marginTop: 16,
  },
  noData: { fontSize: 16, color: 'var(--dim)', letterSpacing: 2, textTransform: 'uppercase', padding: '30px 0' },
}

const TEAM_OPTIONS = [
  { value: '', label: 'All Sizes' },
  { value: '1', label: 'Solo' },
  { value: '2', label: 'Duo' },
  { value: '3', label: 'Trio' },
]

const CustomDot = ({ cx, cy, payload }) => {
  const color = payload.outcome === 'Extracted' ? '#c8ff00' : payload.outcome === 'Died' ? '#ff4f3b' : '#ffe566'
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#000" strokeWidth={1.5} />
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const activeModes = MODES.filter(m => d[m.key]).map(m => m.label)
  return (
    <div style={{ background: '#111', border: '1px solid #333', padding: '8px 12px', fontFamily: 'var(--font)' }}>
      <div style={{ fontSize: 16, textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>{d.map}</div>
      <div style={{ fontSize: 13, color: '#666', marginBottom: activeModes.length ? 4 : 0 }}>
        {d.date}{d.shell ? ` // ${d.shell}` : ''}
      </div>
      {activeModes.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--green)', marginBottom: 4, letterSpacing: 1 }}>
          {activeModes.join(' · ')}
        </div>
      )}
      <div style={{ fontSize: 14, color: d.pnl >= 0 ? '#c8ff00' : '#ff4f3b' }}>Run: {d.pnl >= 0 ? '+' : ''}{d.pnl}</div>
      <div style={{ fontSize: 14, color: d.cum >= 0 ? '#c8ff00' : '#ff4f3b' }}>Total: {d.cum >= 0 ? '+' : ''}{d.cum}</div>
    </div>
  )
}

// Custom reset line label rendered inside the chart
const ResetLabel = ({ viewBox, label }) => {
  const { x, y } = viewBox
  return (
    <g>
      <text x={x + 4} y={y + 12} fill="#ffe566" fontSize={10}
        fontFamily="VT323, monospace" letterSpacing={1}>
        {label}
      </text>
    </g>
  )
}

const modeLabel = (val, name) => val === null ? name : val === true ? `✓ ${name}` : `✕ ${name}`
const cycleVal  = v => v === null ? true : v === true ? false : null
const defaultModeFilters = () => Object.fromEntries(MODES.map(m => [m.key, null]))

export default function ChartView({ runs, resets = [], onBack }) {
  const isMobile = useIsMobile()
  const today = new Date().toISOString().split('T')[0]

  const [filters, setFilters] = useState({
    map: '', shell: '', outcome: '', team: '',
    dateFrom: '', dateTo: '',
    ...defaultModeFilters(),
  })

  const setFilter  = key => e => setFilters(f => ({ ...f, [key]: e.target.value }))
  const cycleMode  = key => () => setFilters(f => ({ ...f, [key]: cycleVal(f[key]) }))
  const clearFilters = () => setFilters({ map: '', shell: '', outcome: '', team: '', dateFrom: '', dateTo: '', ...defaultModeFilters() })

  const hasFilters = filters.map || filters.shell || filters.outcome || filters.team ||
    filters.dateFrom || filters.dateTo || MODES.some(m => filters[m.key] !== null)

  const filtered = useMemo(() => {
    return runs.filter(r => {
      if (filters.map     && r.map       !== filters.map)     return false
      if (filters.shell   && r.shell     !== filters.shell)   return false
      if (filters.outcome && r.outcome   !== filters.outcome) return false
      if (filters.team    && r.team_size !== filters.team)    return false
      if (filters.dateFrom && r.date < filters.dateFrom)      return false
      if (filters.dateTo   && r.date > filters.dateTo)        return false
      for (const m of MODES) {
        if (filters[m.key] === true  && !r[m.key]) return false
        if (filters[m.key] === false &&  r[m.key]) return false
      }
      return true
    })
  }, [runs, filters])

  const sorted = [...filtered].sort((a,b) =>
    a.date.localeCompare(b.date) || (a.created_at||'').localeCompare(b.created_at||'')
  )

  let cum = 0
  const data = sorted.map((r, i) => {
    cum += (r.credits || 0)
    return {
      i: i + 1, map: r.map, date: r.date,
      pnl: r.credits || 0, cum,
      outcome: r.outcome, shell: r.shell, team_size: r.team_size,
      ...Object.fromEntries(MODES.map(m => [m.key, r[m.key]])),
      label: r.map.split(' ')[0].substring(0, 5).toUpperCase(),
      idx: i,
    }
  })

  // Only show resets that fall within the current data range
  const pastResets = resets
    .filter(r => r.reset_date <= today)
    .sort((a,b) => a.reset_date.localeCompare(b.reset_date))

  // For the chart reference lines, we need to know the x-index where each reset falls
  // We'll use the reset date as a label threshold — find the first run index >= each reset date
  const resetLines = pastResets.map(reset => {
    const found = data.find(d => d.date >= reset.reset_date)
    return { ...reset, dataIndex: found ? found.idx : -1 }
  }).filter(r => r.dataIndex >= 0)

  const filteredStats = {
    net:         filtered.reduce((s,r) => s + (r.credits||0), 0),
    extractions: filtered.filter(r => r.outcome === 'Extracted').length,
    deaths:      filtered.filter(r => r.outcome === 'Died').length,
    abandoned:   filtered.filter(r => r.outcome === 'Abandoned').length,
    rate: filtered.length > 0
      ? Math.round(filtered.filter(r => r.outcome==='Extracted').length / filtered.length * 100)
      : null,
  }

  const selStyle = active => ({ ...s.select, borderColor: active ? 'var(--green)' : 'var(--border)' })

  return (
    <div>
      <div style={s.title}>Cumulative P&L</div>

      {/* Standard filters */}
      <div style={s.filtersRow}>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Map</label>
          <select value={filters.map} onChange={setFilter('map')} style={selStyle(filters.map)}>
            <option value="">All Maps</option>
            {MAPS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Shell</label>
          <select value={filters.shell} onChange={setFilter('shell')} style={selStyle(filters.shell)}>
            <option value="">All Shells</option>
            {SHELLS.map(sh => <option key={sh} value={sh}>{sh}</option>)}
          </select>
        </div>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Outcome</label>
          <select value={filters.outcome} onChange={setFilter('outcome')} style={selStyle(filters.outcome)}>
            <option value="">All Outcomes</option>
            {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Team Size</label>
          <select value={filters.team} onChange={setFilter('team')} style={selStyle(filters.team)}>
            {TEAM_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Date From</label>
          <input type="date" value={filters.dateFrom} onChange={setFilter('dateFrom')}
            style={{ ...s.input, borderColor: filters.dateFrom ? 'var(--green)' : 'var(--border)' }} />
        </div>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Date To</label>
          <input type="date" value={filters.dateTo} onChange={setFilter('dateTo')}
            style={{ ...s.input, borderColor: filters.dateTo ? 'var(--green)' : 'var(--border)' }} />
        </div>
      </div>

      {/* Mode toggle filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginRight: 2 }}>Mode:</span>
        {MODES.map(m => (
          <button key={m.key}
            style={filters[m.key] !== null ? s.modeToggleActive : s.modeToggle}
            onClick={cycleMode(m.key)}
            title="Click to cycle: All → Only → Exclude"
          >
            {modeLabel(filters[m.key], m.label)}
          </button>
        ))}
        {hasFilters && (
          <button style={{ ...s.clearBtn, marginLeft: 'auto' }} onClick={clearFilters}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--neg)'; e.target.style.color = 'var(--neg)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--dim)' }}
          >✕ Clear All</button>
        )}
      </div>

      {/* Filter count */}
      <div style={s.filterCount}>
        {filtered.length} of {runs.length} run{runs.length !== 1 ? 's' : ''}{hasFilters ? ' (filtered)' : ''}
      </div>

      {/* Filtered stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', border: '1px solid var(--border)', marginBottom: 16 }}>
        {[
          { label: 'Net P&L',     val: (filteredStats.net>=0?'+':'')+filteredStats.net,  color: filteredStats.net>0?'var(--pos)':filteredStats.net<0?'var(--neg)':'var(--white)' },
          { label: 'Extractions', val: filteredStats.extractions, color: 'var(--pos)' },
          { label: 'Deaths',      val: filteredStats.deaths,      color: 'var(--neg)' },
          { label: 'Abandoned',   val: filteredStats.abandoned,   color: 'var(--warn)' },
          { label: 'Survival',    val: filteredStats.rate !== null ? filteredStats.rate+'%' : '—', color: 'var(--warn)' },
        ].map((stat, i, arr) => (
          <div key={stat.label} style={{ padding: '8px 10px', borderRight: i<arr.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: isMobile ? 18 : 24, lineHeight: 1, color: stat.color }}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div style={s.noData}>No runs match the selected filters</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 16, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="idx" tickFormatter={(val) => data[val]?.label || ''} tick={{ fontFamily: 'VT323', fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'VT323', fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="linear" dataKey="cum" stroke="#c8ff00" strokeWidth={1.5} strokeOpacity={0.7} dot={<CustomDot />} activeDot={false} />
              {/* Reset vertical lines */}
              {resetLines.map(r => (
                <ReferenceLine
                  key={r.id}
                  x={r.dataIndex}
                  stroke="#ffe566"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  label={<ResetLabel label={r.label} />}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          <div style={s.legend}>
            <span style={{ ...s.legendItem, color: '#c8ff00' }}>● Extracted</span>
            <span style={{ ...s.legendItem, color: '#ff4f3b' }}>● Died</span>
            <span style={{ ...s.legendItem, color: '#ffe566' }}>● Abandoned</span>
            {pastResets.length > 0 && <span style={{ ...s.legendItem, color: '#ffe566' }}>╎ Reset</span>}
          </div>
        </>
      )}

      {/* Breakdown table */}
      <div style={s.sep} />
      <div style={s.title}>Breakdown</div>
      {data.length === 0 ? (
        <div style={s.noData}>No data to show</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={s.tbl}>
            <thead>
              <tr>
                {['#','Map','Date','Shell','Team','Modes','Outcome','Credits','Cumulative'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.i}
                  onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background='var(--surface2)')}
                  onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background='transparent')}
                >
                  <td style={{ ...s.td, color: 'var(--dim)' }}>{d.i}</td>
                  <td style={{ ...s.td, color: 'var(--white)', textTransform: 'uppercase', fontSize: 12 }}>{d.map}</td>
                  <td style={s.td}>{d.date}</td>
                  <td style={s.td}>{d.shell || '—'}</td>
                  <td style={s.td}>{d.team_size || '—'}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {MODES.filter(m => d[m.key]).map(m => (
                        <span key={m.key} style={{ fontSize: 10, letterSpacing: 1, color: 'var(--green)', border: '1px solid var(--green)', padding: '1px 3px' }}>
                          {m.label.substring(0,3).toUpperCase()}
                        </span>
                      ))}
                      {!MODES.some(m => d[m.key]) && <span style={{ color: 'var(--dim)' }}>—</span>}
                    </div>
                  </td>
                  <td style={s.td}><Badge outcome={d.outcome} /></td>
                  <td style={{ ...s.td, color: d.pnl>=0?'var(--pos)':'var(--neg)' }}>{d.pnl>=0?'+':''}{d.pnl}</td>
                  <td style={{ ...s.td, color: d.cum>=0?'var(--pos)':'var(--neg)' }}>{d.cum>=0?'+':''}{d.cum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button style={s.backBtn} onClick={onBack}
        onMouseEnter={e => { e.target.style.borderColor='var(--white)'; e.target.style.color='var(--white)' }}
        onMouseLeave={e => { e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--off)' }}
      >← Back</button>
    </div>
  )
}
