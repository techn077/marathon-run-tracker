export default function EmptyState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: 10,
    }}>
      <div style={{ fontSize: 22, letterSpacing: 8, color: '#2a2a2a' }}>◈ ◈ ◈</div>
      <div style={{ fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)' }}>
        No run selected
      </div>
      <div style={{ fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: '#333', marginTop: 2 }}>
        Log a run or select from list
      </div>
    </div>
  )
}
