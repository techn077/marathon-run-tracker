import Badge from './Badge'

const s = {
  sidebar: {
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)',
    overflow: 'hidden',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  headLabel: { fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)' },
  headCount: { fontSize: 16, color: 'var(--green)' },
  list: { flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' },
  msg: { padding: '24px 14px', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', textAlign: 'center' },
  item: {
    padding: '12px 14px',
    borderBottom: '1px solid #111',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  itemTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 },
  itemMeta: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  itemDate: { fontSize: 13, color: 'var(--dim)' },
}

export default function Sidebar({ runs, selectedId, onSelect, loading, isMobile }) {
  const sidebarStyle = isMobile
    ? { ...s.sidebar, borderRight: 'none', height: '100%' }
    : { ...s.sidebar, width: 210, minWidth: 210, height: '100%' }

  return (
    <div style={sidebarStyle}>
      {!isMobile && (
        <div style={s.head}>
          <span style={s.headLabel}>Runs</span>
          <span style={s.headCount}>{runs.length}</span>
        </div>
      )}
      <div style={s.list}>
        {loading && <div style={s.msg}>Loading...</div>}
        {!loading && runs.length === 0 && <div style={s.msg}>No runs logged</div>}
        {!loading && runs.map(run => {
          const credits = run.credits || 0
          const isActive = run.id === selectedId
          return (
            <div
              key={run.id}
              style={{
                ...s.item,
                background: isActive ? 'var(--surface2)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--green)' : '2px solid transparent',
                paddingLeft: isActive ? 12 : 14,
              }}
              onClick={() => onSelect(run.id)}
            >
              <div style={s.itemTop}>
                <span style={{ fontSize: isMobile ? 18 : 16, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--white)' }}>
                  {run.map}
                </span>
                <span style={{ fontSize: isMobile ? 18 : 16, color: credits >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
                  {credits >= 0 ? '+' : ''}{credits}
                </span>
              </div>
              <div style={s.itemMeta}>
                <Badge outcome={run.outcome} />
                <span style={s.itemDate}>{run.date}</span>
                {isMobile && run.shell && <span style={s.itemDate}>// {run.shell}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
