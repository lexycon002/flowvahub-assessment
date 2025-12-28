import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import AuthLayout from "../components/AuthLayout"
import { supabase } from '../lib/supabaseClient'
import { LoaderCircle } from 'lucide-react';


export default function Login() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

        async function handleSignIn(e) {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            return setError('Please enter email and password')
        }

        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (error) return setError(error.message)

        navigate('/')
        }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">
        <h1 className="text-2xl font-bold text-center text-primary">Log in to flowva</h1>
        <p className="text-center text-gray-500 text-sm mt-2">Log in to receive personalized recommendations</p>

        <div className="mt-8 space-y-5 flex flex-col justify-center ">
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-primary" />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#A78BFA]"
                    >{show ? "Hide" : "Show"}
                    </button>
              </div>
            </div>

            <div className="text-right text-sm text-primary cursor-pointer">Forgot Password?</div>

            {error && <div className="text-sm text-red-500">{error}</div>}

                <button
                type="submit"
                disabled={loading}
                className="w-full h-[55px] flex justify-center gap-2 items-center rounded-[100px]
                            bg-[#9013FE] text-white font-medium transition
                            hover:bg-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                {loading && <LoaderCircle className="animate-spin" size={16} />}
                {loading ? "Signing in..." : "Sign in"}
                </button>

          </form>

          <div className="flex items-center gap-3 mt-0">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="w-full flex items-center justify-center gap-3 rounded-lg border py-3 hover:bg-gray-50">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5" />
            <span className="font-medium">Sign in with Google</span>
          </button>

          <p className="text-center text-sm text-gray-500">Don't have an account? <span className="text-[#A78BFA] font-medium cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span></p>
        </div>
      </div>
    </AuthLayout>
  )
}
