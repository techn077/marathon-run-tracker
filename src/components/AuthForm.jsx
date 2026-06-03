import { useState } from 'react'
import { supabase } from '../supabase'
import MarathonIcon from './MarathonIcon'

const s = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh', background: 'var(--bg)', padding: 24,
  },
  box: {
    width: '100%', maxWidth: 400,
    border: '1px solid var(--border)', padding: '36px 32px',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 },
  logoMain: { fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: 'var(--green)', lineHeight: 1 },
  logoSub: { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)', lineHeight: 1 },
  title: {
    fontSize: 20, letterSpacing: 4, textTransform: 'uppercase',
    color: 'var(--white)', marginBottom: 24, paddingBottom: 12,
    borderBottom: '1px solid var(--border)',
  },
  group: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  label: { fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)' },
  input: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)',
    fontFamily: 'var(--font)', fontSize: 18, padding: '8px 12px', outline: 'none',
    width: '100%', borderRadius: 0, transition: 'border-color 0.1s',
  },
  submitBtn: {
    fontFamily: 'var(--font)', fontSize: 18, letterSpacing: 2, textTransform: 'uppercase',
    background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)',
    padding: '8px 0', cursor: 'pointer', width: '100%', marginTop: 8,
    transition: 'all 0.1s',
  },
  switchRow: { marginTop: 18, textAlign: 'center' },
  switchText: { fontSize: 15, color: 'var(--dim)', letterSpacing: 1 },
  switchLink: {
    fontSize: 15, color: 'var(--green)', letterSpacing: 1,
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font)', textDecoration: 'underline', padding: 0,
  },
  error: { fontSize: 15, color: 'var(--neg)', letterSpacing: 1, marginBottom: 12, lineHeight: 1.5 },
  success: { fontSize: 15, color: 'var(--pos)', letterSpacing: 1, marginBottom: 12, lineHeight: 1.5 },
}

export default function AuthForm() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [runnerName, setRunnerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [focused, setFocused] = useState(null)

  const inputStyle = (key) => ({
    ...s.input,
    borderColor: focused === key ? 'var(--green)' : 'var(--border)',
  })

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'signup') {
      if (!runnerName.trim()) { setError('Runner name is required.'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { runner_name: runnerName.trim() } },
      })
      if (error) setError(error.message)
      else setSuccess('Account created! You are now logged in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login')
    setError(null)
    setSuccess(null)
  }

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.logoRow}>
          <img src="/Marathon_Logo_WordMark_Green_ALT.png" width={40} height={40} alt="Marathon" />
          <div>
            <div style={s.logoMain}>Marathon</div>
            <div style={s.logoSub}>Run Tracker</div>
          </div>
        </div>

        <div style={s.title}>{mode === 'login' ? 'Sign In' : 'Create Account'}</div>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        {mode === 'signup' && (
          <div style={s.group}>
            <label style={s.label}>Runner Name</label>
            <input
              style={inputStyle('name')}
              value={runnerName}
              onChange={e => setRunnerName(e.target.value)}
              placeholder="Your callsign..."
              maxLength={24}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
          </div>
        )}

        <div style={s.group}>
          <label style={s.label}>Email</label>
          <input
            style={inputStyle('email')}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div style={s.group}>
          <label style={s.label}>Password</label>
          <input
            style={inputStyle('password')}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          style={s.submitBtn}
          disabled={loading}
          onClick={handleSubmit}
          onMouseEnter={e => { e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--green)' }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={s.switchRow}>
          <span style={s.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button style={s.switchLink} onClick={switchMode}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
