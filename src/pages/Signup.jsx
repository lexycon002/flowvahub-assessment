import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import AuthLayout from "../components/AuthLayout"
import { supabase } from '../lib/supabaseClient'
import { LoaderCircle } from 'lucide-react';

export default function Signup() {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

async function handleSignUp(e) {
  e.preventDefault()
  setError('')

  if (!email || !password) {
    return setError('Please fill in email and password')
  }

  if (password !== confirmPassword) {
    return setError('Passwords do not match')
  }

  setLoading(true)

  const { data, error } = await supabase.auth.signUp({ email, password })

  setLoading(false)

  if (error) {
    return setError(
      error.message.includes('exist')
        ? 'An account with that email already exists. Try signing in.'
        : error.message
    )
  }

  if (data?.user) {
    await supabase
      .from('profiles')
      .upsert({ id: data.user.id, email: data.user.email }, { onConflict: 'id' })
  }

  navigate('/login')
}


  return (
    <AuthLayout>
      <div className="w-96 h-auto bg-white rounded-2xl shadow-xl px-8 py-10">
        <h1 className="text-2xl font-bold text-center text-primary">Create Your Account</h1>
        <p className="text-center text-gray-500 text-sm mt-2">Sign up to manage your tools</p>

        <div className="mt-8 space-y-5 flex flex-col justify-center ">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input type={show1 ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-primary" />
                <button
                    type="button"
                    onClick={() => setShow1(!show1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#A78BFA]"
                    >
                    {show1 ? "Hide" : "Show"}
                    </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative mt-1">
                <input type={show2 ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-primary" />
                <button
                    type="button"
                    onClick={() => setShow2(!show2)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#A78BFA]"
                    >
                    {show2 ? "Hide" : "Show"}
                    </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}
                <button
                type="submit"
                disabled={loading}
                className="w-full h-[55px] flex justify-center gap-2 items-center rounded-[100px] bg-[#9013FE] text-white font-medium transition hover:bg-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading && <LoaderCircle className="animate-spin" size={16} />}
                {loading ? "Creating account..." : "Sign up Account"}
                </button>

          </form>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="w-full flex items-center justify-center gap-3 rounded-lg border py-3 hover:bg-gray-50">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5" />
            <span className="font-medium">Sign in with Google</span>
          </button>

          <p className="text-center text-sm text-gray-500">Already have an account? <span className="text-primary font-medium cursor-pointer" onClick={() => navigate('/login')}>Log In</span></p>
        </div>
      </div>
    </AuthLayout>
  )
}
