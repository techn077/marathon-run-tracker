import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import Badge from './Badge'

const s = {
  title: {
    fontSize: 16, letterSpacing: 4, textTransform: 'uppercase',
    color: 'var(--green)', marginBottom: 14, paddingBottom: 6,
    borderBottom: '1px solid var(--border)',
  },
  legend: { display: 'flex', gap: 18, marginBottom: 20, marginTop: 4 },
  legendItem: { fontSize: 15, letterSpacing: 2, textTransform: 'uppercase' },
  sep: { height: 1, background: 'var(--border)', margin: '20px 0' },
  tbl: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--border)' },
  td: { fontSize: 15, padding: '7px 10px', borderBottom: '1px solid #111', color: 'var(--off)' },
  backBtn: {
    fontFamily: 'var(--font)', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase',
    padding: '5px 16px', background: 'transparent', border: '1px solid var(--border2)',
    color: 'var(--off)', cursor: 'pointer', marginTop: 16,
  },
}

const CustomDot = (props) => {
  const { cx, cy, payload } = props
  const color = payload.outcome === 'Extracted' ? '#c8ff00' : payload.outcome === 'Died' ? '#ff4f3b' : '#ffe566'
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#000" strokeWidth={1.5} />
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#111', border: '1px solid #333', padding: '8px 12px', fontFamily: 'var(--font)' }}>
      <div style={{ fontSize: 16, textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>{d.map}</div>
      <div style={{ fontSize: 14, color: '#666' }}>{d.date}</div>
      <div style={{ fontSize: 14, color: d.pnl >= 0 ? '#c8ff00' : '#ff4f3b' }}>Run: {d.pnl >= 0 ? '+' : ''}{d.pnl}</div>
      <div style={{ fontSize: 14, color: d.cum >= 0 ? '#c8ff00' : '#ff4f3b' }}>Total: {d.cum >= 0 ? '+' : ''}{d.cum}</div>
    </div>
  )
}

export default function ChartView({ runs, onBack }) {
  if (!runs.length) {
    return (
      <div>
        <div style={s.title}>Cumulative P&L</div>
        <div style={{ fontSize: 18, color: 'var(--dim)', letterSpacing: 2, textTransform: 'uppercase', padding: '40px 0' }}>No data yet</div>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
      </div>
    )
  }

  const sorted = [...runs].sort((a, b) => a.date.localeCompare(b.date) || a.created_at?.localeCompare(b.created_at))
  let cum = 0
  const data = sorted.map((r, i) => {
    cum += (r.credits || 0)
    return {
      i: i + 1,
      map: r.map,
      date: r.date,
      pnl: r.credits || 0,
      cum,
      outcome: r.outcome,
      shell: r.shell,
      team_size: r.team_size,
      label: r.map.split(' ')[0].substring(0, 5).toUpperCase(),
    }
  })

  return (
    <div>
      <div style={s.title}>Cumulative P&L</div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontFamily: 'VT323', fontSize: 12, fill: '#444', letterSpacing: 1 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontFamily: 'VT323', fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
          <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="linear"
            dataKey="cum"
            stroke="#c8ff00"
            strokeWidth={1.5}
            strokeOpacity={0.7}
            dot={<CustomDot />}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={s.legend}>
        <span style={{ ...s.legendItem, color: '#c8ff00' }}>● Extracted</span>
        <span style={{ ...s.legendItem, color: '#ff4f3b' }}>● Died</span>
        <span style={{ ...s.legendItem, color: '#ffe566' }}>● Abandoned</span>
      </div>

      <div style={s.sep} />
      <div style={s.title}>Breakdown</div>

      <table style={s.tbl}>
        <thead>
          <tr>
            {['#', 'Map', 'Date', 'Shell', 'Team', 'Outcome', 'Credits', 'Cumulative'].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.i} onMouseEnter={e => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = 'var(--surface2)') }} onMouseLeave={e => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = 'transparent') }}>
              <td style={{ ...s.td, color: 'var(--dim)' }}>{d.i}</td>
              <td style={{ ...s.td, color: 'var(--white)', textTransform: 'uppercase', fontSize: 13 }}>{d.map}</td>
              <td style={s.td}>{d.date}</td>
              <td style={s.td}>{d.shell || '—'}</td>
              <td style={s.td}>{d.team_size || '—'}</td>
              <td style={s.td}><Badge outcome={d.outcome} /></td>
              <td style={{ ...s.td, color: d.pnl >= 0 ? 'var(--pos)' : 'var(--neg)', fontWeight: 600 }}>{d.pnl >= 0 ? '+' : ''}{d.pnl}</td>
              <td style={{ ...s.td, color: d.cum >= 0 ? 'var(--pos)' : 'var(--neg)', fontWeight: 600 }}>{d.cum >= 0 ? '+' : ''}{d.cum}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={s.backBtn}
        onClick={onBack}
        onMouseEnter={e => { e.target.style.borderColor = 'var(--white)'; e.target.style.color = 'var(--white)' }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--off)' }}
      >
        ← Back
      </button>
    </div>
  )
}
