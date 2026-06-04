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
import useIsMobile from './hooks/useIsMobile'

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    background: 'var(--bg)',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 18px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  spacer: { flex: 1 },
  panel: {
    flex: 1,
    overflowY: 'auto',
    padding: 18,
    WebkitOverflowScrolling: 'touch',
  },
  btn: {
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    padding: '5px 16px',
    background: 'transparent',
    border: '1px solid var(--border2)',
    color: 'var(--off)',
    transition: 'all 0.1s',
  },
  btnPrimary: {
    borderColor: 'var(--green)',
    color: 'var(--green)',
  },
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100dvh', fontSize: 20, letterSpacing: 4,
    textTransform: 'uppercase', color: 'var(--dim)',
    fontFamily: 'var(--font)',
  },
  // Mobile bottom nav
  mobileNav: {
    display: 'flex',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  mobileNavBtn: {
    flex: 1,
    fontFamily: 'var(--font)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    padding: '10px 4px 8px',
    background: 'transparent',
    border: 'none',
    color: 'var(--dim)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    transition: 'color 0.1s',
    borderRight: '1px solid var(--border)',
  },
  mobileNavIcon: { fontSize: 20, lineHeight: 1 },
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('list') // 'list' | 'detail' | 'form' | 'chart'
  const isMobile = useIsMobile()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) { setRuns([]); setSelectedId(null); setView('list') }
    })
    return () => subscription.unsubscribe()
  }, [])

  const runner = session?.user?.user_metadata?.runner_name || session?.user?.email?.split('@')[0] || ''

  const fetchRuns = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRuns(data || [])
    setLoading(false)
  }, [session])

  useEffect(() => { fetchRuns() }, [fetchRuns])

  const handleNewRun = async (formData) => {
    const payload = { ...formData, runner, user_id: session.user.id }
    const { data, error } = await supabase.from('runs').insert([payload]).select().single()
    if (error) { alert('Error saving run: ' + error.message); return }
    setRuns(prev => [data, ...prev])
    setSelectedId(data.id)
    setView('detail')
  }

  const handleDeleteRun = async (id) => {
    const { error } = await supabase.from('runs').delete().eq('id', id)
    if (error) { alert('Error deleting run: ' + error.message); return }
    setRuns(prev => prev.filter(r => r.id !== id))
    setSelectedId(null)
    setView('list')
  }

  const handleEditRun = async (id, formData) => {
    const { data, error } = await supabase.from('runs').update(formData).eq('id', id).select().single()
    if (error) { alert('Error updating run: ' + error.message); return }
    setRuns(prev => prev.map(r => r.id === id ? data : r))
    setSelectedId(id)
    setView('detail')
  }

  const handleSelectRun = (id) => {
    setSelectedId(id)
    setView('detail')
  }

  const handleSignOut = async () => { await supabase.auth.signOut() }

  const stats = {
    net: runs.reduce((s, r) => s + (r.credits || 0), 0),
    extractions: runs.filter(r => r.outcome === 'Extracted').length,
    deaths: runs.filter(r => r.outcome === 'Died').length,
    rate: runs.length > 0
      ? Math.round((runs.filter(r => r.outcome === 'Extracted').length / runs.length) * 100)
      : null,
  }

  const selectedRun = runs.find(r => r.id === selectedId) || null

  if (authLoading) return <div style={styles.loading}>Initializing...</div>
  if (!session) return <AuthForm />

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile) {
    const navItems = [
      { id: 'list',  icon: '≡', label: 'Runs' },
      { id: 'form',  icon: '+', label: 'New' },
      { id: 'chart', icon: '◈', label: 'Chart' },
    ]

    return (
      <div style={styles.app}>
        <Header runner={runner} runCount={runs.length} onSignOut={handleSignOut} isMobile />
        <StatsBar stats={stats} isMobile />

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {error && <div style={{ color: 'var(--neg)', fontSize: 14, padding: '8px 16px' }}>Error: {error}</div>}

          {view === 'list' && (
            <Sidebar
              runs={runs}
              selectedId={selectedId}
              onSelect={handleSelectRun}
              loading={loading}
              isMobile
            />
          )}
          {view === 'form' && (
            <div style={{ padding: 16 }}>
              <RunForm onSubmit={handleNewRun} onCancel={() => setView('list')} />
            </div>
          )}
          {view === 'detail' && selectedRun && (
            <div style={{ padding: 16 }}>
              <button
                style={{ ...styles.btn, marginBottom: 14, fontSize: 14 }}
                onClick={() => setView('list')}
              >
                ← Back
              </button>
              <RunDetail run={selectedRun} onDelete={handleDeleteRun} onEdit={handleEditRun} />
            </div>
          )}
          {view === 'detail' && !selectedRun && (
            <div style={{ padding: 16 }}>
              <button style={{ ...styles.btn, marginBottom: 14 }} onClick={() => setView('list')}>← Back</button>
              <EmptyState />
            </div>
          )}
          {view === 'chart' && (
            <div style={{ padding: 16 }}>
              <ChartView runs={runs} onBack={() => setView('list')} />
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <nav style={styles.mobileNav}>
          {navItems.map((item, i) => (
            <button
              key={item.id}
              style={{
                ...styles.mobileNavBtn,
                borderRight: i < navItems.length - 1 ? '1px solid var(--border)' : 'none',
                color: view === item.id ? 'var(--green)' : 'var(--dim)',
                borderTop: view === item.id ? '1px solid var(--green)' : '1px solid transparent',
              }}
              onClick={() => { setView(item.id); if (item.id !== 'detail') setSelectedId(null) }}
            >
              <span style={styles.mobileNavIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div style={styles.app}>
      <Header runner={runner} runCount={runs.length} onSignOut={handleSignOut} />
      <StatsBar stats={stats} />
      <div style={styles.body}>
        <Sidebar runs={runs} selectedId={selectedId} onSelect={handleSelectRun} loading={loading} />
        <div style={styles.content}>
          <div style={styles.toolbar}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => { setView('form'); setSelectedId(null) }}
              onMouseEnter={e => { e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--bg)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--green)' }}
            >
              + New Run
            </button>
            <div style={styles.spacer} />
            <button
              style={styles.btn}
              onClick={() => setView('chart')}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--white)'; e.target.style.color = 'var(--white)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--off)' }}
            >
              Chart
            </button>
          </div>
          <div style={styles.panel}>
            {error && <div style={{ color: 'var(--neg)', fontFamily: 'var(--font)', fontSize: 16, marginBottom: 12 }}>DB Error: {error}</div>}
            {view === 'list'   && <EmptyState />}
            {view === 'empty'  && <EmptyState />}
            {view === 'form'   && <RunForm onSubmit={handleNewRun} onCancel={() => setView('list')} />}
            {view === 'detail' && selectedRun && <RunDetail run={selectedRun} onDelete={handleDeleteRun} onEdit={handleEditRun} />}
            {view === 'chart'  && <ChartView runs={runs} onBack={() => setView('list')} />}
          </div>
        </div>
      </div>
    </div>
  )
}
