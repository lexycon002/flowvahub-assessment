import { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../lib/supabaseClient'

export default function AuthModal({ onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode) // 'signin' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // confirmPassword is not used in this compact modal (signup uses full page); remove to avoid linter warnings
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
    } catch (err) {
      setError(err?.message || String(err))
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    setError('')

    // basic validation for both modes
    if (!email || !password) {
      setError('Please provide both email and password')
      return
    }
    // In modal signup we do not show a confirm-password field; rely on full-page signup for stricter checks

    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          // friendly message for duplicate email
          if (error.message && /exist/i.test(error.message)) setError('An account with that email already exists. Try signing in.')
          else setError(error.message)
          setLoading(false)
          return
        }
        // ensure profile exists
        if (data?.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, email: data.user.email }, { onConflict: 'id' })
        }
        setLoading(false)
        onClose()
        return
      }

      // sign in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      console.log('signInWithPassword response', { data, error })
      if (error) {
        console.error('Sign in error', error)
        setError(error.message || 'Sign in failed')
        setLoading(false)
        return
      }
      // guard: if no user returned, show friendly message
      if (!data?.user) {
        setError('Sign in did not return a user. Please check your credentials or try again.')
        setLoading(false)
        return
      }
      setLoading(false)
      onClose()
    } catch (err) {
      setError(err.message || String(err))
      setLoading(false)
    }
  }

  return (
    <Modal title={mode === 'signup' ? 'Create your account' : 'Welcome back'} onClose={onClose}>
     

      <div className="w-full max-w-md rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-violet-600">Log in to flowva</h2>

        <p className="text-sm text-center text-slate-500 mb-6">
            Log in to receive personalized recommendations
        </p>

  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Email */}
    <div>
      <label className="block text-sm text-slate-600 mb-1">
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="user@example.com"
        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
        required
      />
    </div>

    {/* Password */}
    <div>
      <label className="block text-sm text-slate-600 mb-1">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-sm text-violet-500"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>

    {/* Forgot password */}
    <div className="text-right">
      <button
        type="button"
        className="text-sm text-violet-600 hover:underline"
      >
        Forgot Password?
      </button>
    </div>

    {/* Error */}
    {error && (
      <p className="text-sm text-red-500 text-center">
        {error}
      </p>
    )}

    {/* Sign in button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 rounded-full bg-violet-600 text-white py-3 font-medium hover:bg-violet-700 transition disabled:opacity-60"
    >
      {loading ? 'Signing in…' : 'Sign in'}
    </button>
  </form>

  {/* Divider */}
  <div className="flex items-center gap-3 my-6 text-xs text-slate-400">
    <div className="flex-1 h-px bg-slate-200" />
    <span>or</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>

  {/* Google */}
  <button
    onClick={handleGoogle}
    className="w-full flex items-center justify-center gap-3 border rounded-lg py-2 hover:bg-slate-50 transition"
  >
    <svg width="18" height="18" viewBox="0 0 533.5 544.3">
      <path d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95.1h147.1c-6.3 34-25.3 62.9-54.1 82.2v68.1h87.3c51-47 81.2-116.2 81.2-195.2z" fill="#4285F4"/>
      <path d="M272 544.3c73.2 0 134.8-24.3 179.7-66.3l-87.3-68.1c-24.3 16.2-55.3 25.8-92.4 25.8-70.9 0-131-47.9-152.3-112.1H29.6v70.5C74.1 487.9 167.4 544.3 272 544.3z" fill="#34A853"/>
      <path d="M119.7 323.6c-10.8-32.1-10.8-66.4 0-98.5V154.6H29.6c-39.3 77.2-39.3 168.3 0 245.5l90.1-76.5z" fill="#FBBC05"/>
      <path d="M272 107.7c39.8 0 75.6 13.7 103.8 40.6l77.9-77.9C405.9 24 344.3 0 272 0 167.4 0 74.1 56.4 29.6 154.6l90.1 70.5C141 155.6 201.1 107.7 272 107.7z" fill="#EA4335"/>
    </svg>
    <span className="text-sm font-medium">
      Sign in with Google
    </span>
  </button>

  {/* Footer */}
  <p className="text-sm text-center text-slate-500 mt-6">
    Don&apos;t have an account?{' '}
    <button
      onClick={() => setMode('signup')}
      className="text-violet-600 font-medium"
    >
      Sign up
    </button>
  </p>
</div>

    </Modal>
  )
}
