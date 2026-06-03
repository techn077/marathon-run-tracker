const s = {
  hdr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: 52,
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: 10 },
  logoMain: { fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--green)', lineHeight: 1 },
  logoSub: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', lineHeight: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  runnerRow: { display: 'flex', alignItems: 'center', gap: 6 },
  label: { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' },
  name: { fontSize: 15, letterSpacing: 1, color: 'var(--white)' },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--green)', boxShadow: '0 0 5px var(--green)',
    flexShrink: 0, animation: 'blink 2.5s infinite',
  },
  signOutBtn: {
    fontFamily: 'var(--font)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid var(--border2)', color: 'var(--dim)',
    padding: '4px 10px', cursor: 'pointer', transition: 'all 0.1s',
  },
}

export default function Header({ runner, runCount, onSignOut, isMobile }) {
  return (
    <header style={s.hdr}>
      <div style={s.left}>
        <img src="/Marathon_Logo_WordMark_Green_ALT.png" width={32} height={32} alt="Marathon" />
        <div>
          <div style={s.logoMain}>Marathon</div>
          {!isMobile && <div style={s.logoSub}>Run Tracker</div>}
        </div>
      </div>
      <div style={s.right}>
        {!isMobile && (
          <div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' }}>
            {runCount} Run{runCount !== 1 ? 's' : ''}
          </div>
        )}
        <div style={s.runnerRow}>
          {!isMobile && <span style={s.label}>Runner:</span>}
          <span style={s.name}>{runner}</span>
        </div>
        <div style={s.dot} />
        <button
          style={s.signOutBtn}
          onClick={onSignOut}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--neg)'; e.target.style.color = 'var(--neg)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--dim)' }}
        >
          {isMobile ? 'Out' : 'Sign Out'}
        </button>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 55%{opacity:0.15} }`}</style>
    </header>
  )
}
