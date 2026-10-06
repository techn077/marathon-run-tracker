import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Sidebar from './components/Sidebar'
import RunDetail from './components/RunDetail'
import RunForm from './components/RunForm'
import ChartView from './components/ChartView'
import EmptyState from './components/EmptyState'
import AuthForm from './components/AuthForm'
import ResetManager from './components/ResetManager'
import useIsMobile from './hooks/useIsMobile'

const styles = {
  app: { display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' },
  body: { display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' },
  content: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' },
  toolbar: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px',
    borderBottom: '1px solid var(--border)', background: 'var(--bg)', flexShrink: 0,
  },
  spacer: { flex: 1 },
  panel: { flex: 1, overflowY: 'auto', padding: 18, WebkitOverflowScrolling: 'touch' },
  btn: {
    fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 16px',
    background: 'transparent', border: '1px solid var(--border2)', color: 'var(--off)', transition: 'all 0.1s',
  },
  btnPrimary: { borderColor: 'var(--green)', color: 'var(--green)' },
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh',
    fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--dim)', fontFamily: 'var(--font)',
  },
  mobileNav: { display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--bg)', flexShrink: 0 },
  mobileNavBtn: {
    flex: 1, fontFamily: 'var(--font)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
    padding: '10px 4px 8px', background: 'transparent', border: 'none', color: 'var(--dim)',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    transition: 'color 0.1s', borderRight: '1px solid var(--border)',
  },
  mobileNavIcon: { fontSize: 18, lineHeight: 1 },
}

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function App() {
  const [session, setSession]     = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [runs, setRuns]           = useState([])
  const [resets, setResets]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView]           = useState('list')
  const isMobile                  = useIsMobile()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (!session) { setRuns([]); setResets([]); setSelectedId(null); setView('list') }
    })
    return () => subscription.unsubscribe()
  }, [])

  const runner = session?.user?.user_metadata?.runner_name || session?.user?.email?.split('@')[0] || ''

  const fetchData = useCallback(async () => {
    if (!session) return
    setLoading(true); setError(null)
    const [runsRes, resetsRes] = await Promise.all([
      supabase.from('runs').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('resets').select('*').order('reset_date', { ascending: true }),
    ])
    if (runsRes.error)   setError(runsRes.error.message)
    else setRuns(runsRes.data || [])
    if (!resetsRes.error) setResets(resetsRes.data || [])
    setLoading(false)
  }, [session])

  useEffect(() => { fetchData() }, [fetchData])

  // Compute since-last-reset P&L
  const today = localToday()
  const pastResets = resets.filter(r => r.reset_date <= today).sort((a,b) => a.reset_date.localeCompare(b.reset_date))
  const lastReset  = pastResets[pastResets.length - 1] || null
  const sinceReset = lastReset
    ? runs.filter(r => r.date >= lastReset.reset_date).reduce((s,r) => s + (r.credits||0), 0)
    : null

  const sinceResetRuns = lastReset
    ? runs.filter(r => r.date >= lastReset.reset_date)
    : null

  const stats = {
    total:       runs.length,
    net:         runs.reduce((s,r) => s + (r.credits||0), 0),
    extractions: runs.filter(r => r.outcome === 'Extracted').length,
    deaths:      runs.filter(r => r.outcome === 'Died').length,
    rate:        runs.length > 0 ? Math.round(runs.filter(r=>r.outcome==='Extracted').length / runs.length * 100) : null,
    // Since reset stats
    sinceReset,
    lastResetDate:           lastReset?.reset_date || null,
    sinceResetTotal:         sinceResetRuns ? sinceResetRuns.length : null,
    sinceResetExtractions:   sinceResetRuns ? sinceResetRuns.filter(r => r.outcome === 'Extracted').length : null,
    sinceResetDeaths:        sinceResetRuns ? sinceResetRuns.filter(r => r.outcome === 'Died').length : null,
    sinceResetRate:          sinceResetRuns && sinceResetRuns.length > 0
      ? Math.round(sinceResetRuns.filter(r => r.outcome === 'Extracted').length / sinceResetRuns.length * 100)
      : sinceResetRuns ? 0 : null,
  }

  const handleNewRun = async (formData) => {
    const payload = { ...formData, runner, user_id: session.user.id }
    const { data, error } = await supabase.from('runs').insert([payload]).select().single()
    if (error) { alert('Error saving run: ' + error.message); return }
    setRuns(prev => [data, ...prev]); setSelectedId(data.id); setView('detail')
  }

  const handleDeleteRun = async (id) => {
    const { error } = await supabase.from('runs').delete().eq('id', id)
    if (error) { alert('Error deleting run: ' + error.message); return }
    setRuns(prev => prev.filter(r => r.id !== id)); setSelectedId(null); setView('list')
  }

  const handleEditRun = async (id, formData) => {
    const { error } = await supabase.from('runs').update(formData).eq('id', id)
    if (error) { alert('Error updating run: ' + error.message); return }
    setRuns(prev => prev.map(r => r.id === id ? { ...r, ...formData } : r))
    setView('empty'); setSelectedId(id); setTimeout(() => setView('detail'), 0)
  }

  const handleSelectRun = (id) => { setSelectedId(id); setView('detail') }
  const handleSignOut   = async () => { await supabase.auth.signOut() }

  const selectedRun = runs.find(r => r.id === selectedId) || null

  if (authLoading) return <div style={styles.loading}>Initializing...</div>
  if (!session)    return <AuthForm />

  const renderPanel = () => {
    if (error) return <div style={{ color: 'var(--neg)', fontSize: 16, marginBottom: 12 }}>Error: {error}</div>
    switch (view) {
      case 'form':   return <RunForm onSubmit={handleNewRun} onCancel={() => setView('list')} />
      case 'detail': return selectedRun
        ? <RunDetail run={selectedRun} onDelete={handleDeleteRun} onEdit={handleEditRun} />
        : <EmptyState />
      case 'chart':  return <ChartView runs={runs} resets={resets} onBack={() => setView('list')} />
      case 'resets': return <ResetManager resets={resets} onResetsChange={setResets} userId={session.user.id} />
      default:       return <EmptyState />
    }
  }

  // ── MOBILE ──────────────────────────────────────────────────────
  if (isMobile) {
    const navItems = [
      { id: 'list',   icon: '≡', label: 'Runs'   },
      { id: 'form',   icon: '+', label: 'New'    },
      { id: 'chart',  icon: '◈', label: 'Chart'  },
      { id: 'resets', icon: '⟳', label: 'Resets' },
    ]
    return (
      <div style={styles.app}>
        <Header runner={runner} runCount={runs.length} onSignOut={handleSignOut} isMobile />
        <StatsBar stats={stats} isMobile />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {view === 'list' ? (
            <Sidebar runs={runs} selectedId={selectedId} onSelect={handleSelectRun} loading={loading} isMobile />
          ) : (
            <div style={{ padding: 16 }}>
              {view !== 'form' && view !== 'resets' && (
                <button style={{ ...styles.btn, marginBottom: 14, fontSize: 14 }} onClick={() => setView('list')}>← Back</button>
              )}
              {renderPanel()}
            </div>
          )}
        </div>
        <nav style={styles.mobileNav}>
          {navItems.map((item, i) => (
            <button key={item.id} style={{
              ...styles.mobileNavBtn,
              borderRight: i < navItems.length-1 ? '1px solid var(--border)' : 'none',
              color: view === item.id ? 'var(--green)' : 'var(--dim)',
              borderTop: view === item.id ? '2px solid var(--green)' : '2px solid transparent',
            }}
              onClick={() => { setView(item.id); if (!['detail'].includes(item.id)) setSelectedId(null) }}
            >
              <span style={styles.mobileNavIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // ── DESKTOP ─────────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      <Header runner={runner} runCount={runs.length} onSignOut={handleSignOut} />
      <StatsBar stats={stats} />
      <div style={styles.body}>
        <Sidebar runs={runs} selectedId={selectedId} onSelect={handleSelectRun} loading={loading} />
        <div style={styles.content}>
          <div style={styles.toolbar}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => { setView('form'); setSelectedId(null) }}
              onMouseEnter={e => { e.target.style.background='var(--green)'; e.target.style.color='var(--bg)' }}
              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='var(--green)' }}
            >+ New Run</button>
            <div style={styles.spacer} />
            <button style={{ ...styles.btn, ...(view==='resets' ? styles.btnPrimary : {}) }}
              onClick={() => setView('resets')}
              onMouseEnter={e => { e.target.style.borderColor='var(--white)'; e.target.style.color='var(--white)' }}
              onMouseLeave={e => {
                e.target.style.borderColor = view==='resets' ? 'var(--green)' : 'var(--border2)'
                e.target.style.color = view==='resets' ? 'var(--green)' : 'var(--off)'
              }}
            >Resets</button>
            <button style={styles.btn}
              onClick={() => setView('chart')}
              onMouseEnter={e => { e.target.style.borderColor='var(--white)'; e.target.style.color='var(--white)' }}
              onMouseLeave={e => { e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--off)' }}
            >Chart</button>
          </div>
          <div style={styles.panel}>{renderPanel()}</div>
        </div>
      </div>
    </div>
  )
}
