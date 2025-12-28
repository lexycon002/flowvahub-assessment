import React, { useEffect, useMemo, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import RewardCard from '../components/RewardCard'
import Modal from '../components/Modal'
import ClaimUploadModal from '../components/ClaimUploadModal'
import ReclaimImg from "../assets/reclaim.png"
import { Calendar, Award, UserPlus, Gift, Bell,Zap } from 'lucide-react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const TABS = { EARN: 'earn', REDEEM: 'redeem' }

function Rewards() {
  const [tab, setTab] = useState(TABS.EARN)
  const envMissing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY
  const [forceDemo] = useState(false)
  const demoMode = forceDemo || envMissing

  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [streakDays, setStreakDays] = useState(1)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimedToday, setClaimedToday] = useState(false)
  const [showClaim50Modal, setShowClaim50Modal] = useState(false)
  const navigate = useNavigate()
  const [redeemFilter, setRedeemFilter] = useState('all')
  // Fetch rewards
  async function fetchRewards() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('rewards').select('*').order('points_required', { ascending: true })
    if (error) setError(error.message)
    else setRewards(data || [])
    setLoading(false)
  }



  // Fetch claims & streak
  async function fetchClaimsAndStreak(userId) {
    if (!userId) return
    const { data } = await supabase.from('claims').select('claim_date').eq('user_id', userId).order('claim_date', { ascending: false }).limit(365)
    const claimDates = new Set((data || []).map(c => (c.claim_date || '').slice(0, 10)))
    const todayStr = new Date().toISOString().slice(0, 10)
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(new Date().getDate() - i)
      const ds = d.toISOString().slice(0, 10)
      if (claimDates.has(ds)) streak++
      else break
    }
    setStreakDays(streak)
    setClaimedToday(claimDates.has(todayStr))
  }

  // Fetch user points
  async function fetchUserPoints(userId) {
    const { data, error } = await supabase.from('profiles').select('points').eq('id', userId).single()
    if (!error && data) setUserPoints(data.points || 0)
  }

  useEffect(() => {
    if (!demoMode) fetchRewards()
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
      if (data?.user) await fetchUserPoints(data.user.id)
      if (data?.user) await fetchClaimsAndStreak(data.user.id)
    }
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchUserPoints(session.user.id)
      else setUserPoints(0)
    })
    return () => listener?.subscription?.unsubscribe()
  }, [demoMode])

  useEffect(() => {
    if (demoMode) {
      const last = localStorage.getItem('demo_last_claim')
      const ds = Number(localStorage.getItem('demo_streak') || 0)
      setStreakDays(ds)
      setClaimedToday(last === new Date().toISOString().slice(0, 10))
    }
  }, [demoMode])

  // Claim daily points
  async function claimDailyPoints() {
    if (!user && !demoMode) return alert('Please sign in to claim points')
    setClaiming(true)
    setShowClaimModal(true)

    
    if (!demoMode) {
      const today = new Date().toISOString().slice(0, 10)
      const { error } = await supabase.from('claims').insert([{ user_id: user.id, claim_date: today, points: 5 }])
      if (error) { alert('Error: ' + error.message); setClaiming(false); return }
      const { data: profileData } = await supabase.from('profiles').select('points').eq('id', user.id).single()
      const newPoints = (profileData?.points || 0) + 5
      await supabase.from('profiles').update({ points: newPoints }).eq('id', user.id)
      setUserPoints(newPoints)
      await fetchClaimsAndStreak(user.id)
    } else {
      setUserPoints(p => p + 5)
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem('demo_last_claim', today)
      const ds = Number(localStorage.getItem('demo_streak') || 0) + 1
      localStorage.setItem('demo_streak', String(ds))
      setStreakDays(ds)
      setClaimedToday(true)
    }
    setShowClaimModal(true)
    setTimeout(() => setShowClaimModal(false), 2200)
    setClaiming(false)
  }

  // Filtered rewards
  const filteredRewards = useMemo(() => {
    if (redeemFilter === 'all') return rewards
    if (redeemFilter === 'unlocked') return rewards.filter(r => (r.points_required || 0) > 0 && userPoints >= (r.points_required || 0))
    if (redeemFilter === 'locked') return rewards.filter(r => (r.points_required || 0) > 0 && userPoints < (r.points_required || 0))
    if (redeemFilter === 'coming') return rewards.filter(r => (r.points_required || 0) === 0)
    return rewards
  }, [rewards, userPoints, redeemFilter])

  const counts = useMemo(() => ({
    all: rewards.length,
    coming: rewards.filter(r => (r.points_required || 0) === 0).length,
    unlocked: rewards.filter(r => (r.points_required || 0) > 0 && userPoints >= (r.points_required || 0)).length,
    locked: rewards.filter(r => (r.points_required || 0) > 0 && userPoints < (r.points_required || 0)).length,
  }), [rewards, userPoints])

  const days = ['M','T','W','T','F','S','S']
  const todayIndex = (new Date().getDay() + 6) % 7

  return (
    <div className="mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-semibold mt-5">Rewards Hub</h1>
          <p className="text-[12px] text-slate-500">Earn points, unlock rewards, and celebrate your progress!</p>
        </div>
        <div className="relative bg-slate-300 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer">
          <Bell className="w-6 h-6 text-black" />
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">1</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <nav className="flex gap-4 md:gap-6 whitespace-nowrap">
          <button onClick={() => setTab(TABS.EARN)} className={`pb-2 ${tab === TABS.EARN ? 'border-b-4 border-violet-500 text-violet-700' : 'border-b-4 border-transparent text-slate-600'}`}>Earn Points</button>
          <button onClick={() => setTab(TABS.REDEEM)} className={`pb-2 ${tab === TABS.REDEEM ? 'border-b-4 border-violet-500 text-violet-700' : 'border-b-4 border-transparent text-slate-600'}`}>Redeem Rewards</button>
        </nav>
      </div>

      {/* EARN Section */}
      {tab === TABS.EARN && (
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Points Balance */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium flex items-center gap-1"><Award className="w-4 h-4 text-purple-600"/> Points Balance</div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-3xl font-bold text-violet-600">{userPoints}</span>
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">⭐</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Progress to <span className="font-medium text-black">$5 Gift Card</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                <div className="h-2 bg-violet-500" style={{width: `${Math.min(100,(userPoints/5000)*100)}%`}} />
              </div>
              <div className="text-xs text-gray-400 mt-1">Keep earning points!</div>
            </div>

            {/* Daily Streak */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium flex items-center gap-1"><Calendar className="w-4 h-4 text-blue-400"/> Daily Streak</div>
              <div className="text-3xl font-bold text-violet-600 mt-2">{streakDays} day</div>
              <div className="flex gap-1 mt-2">
                {days.map((d,i)=><div key={i} className={`w-8 h-8 flex items-center justify-center rounded-full ${i===todayIndex ? (claimedToday?'bg-gray-300 text-gray-700':'bg-violet-600 text-white'):'bg-slate-100 text-slate-400'}`}>{d}</div>)}
              </div>
              <div className="text-xs text-gray-400 mt-2 mb-2">Check in daily to earn +5 points</div>
              <button disabled={claiming || claimedToday} onClick={claimDailyPoints} className={`w-full py-2 flex items-center justify-center rounded-full text-white ${claimedToday?'bg-gray-300 text-gray-700':'bg-gradient-to-r from-violet-600 to-fuchsia-500'}`}> <span><Zap/></span>{claiming?'Claiming…':claimedToday?'Claimed':'Claim Today\'s Points'}</button>
            </div>

            {/* Featured Reward */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-sky-400 text-white">
                <div className="text-xs mb-2 bg-white/20 inline-block px-2 py-1 rounded-full">Featured</div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold">Top Tool Spotlight</h3>
                  <img src={ReclaimImg} alt="Reclaim" className="w-12 h-12 rounded-full bg-white/20 p-1"/>
                </div>
                <p className="text-sm font-bold opacity-90 mt-1">Reclaim</p>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500">Reclaim.ai is an AI-powered calendar assistant. Free to try — earn points when you sign up!</p>
                <div className="flex justify-between mt-3">
                  <button onClick={()=>navigate('/signup')} className="bg-violet-600 text-white py-1 px-3 rounded-full text-sm flex items-center gap-1"><UserPlus className="w-4 h-4"/> Sign Up</button>
                  <button onClick={()=>setShowClaim50Modal(true)} className="bg-gradient-to-r from-purple-600 to-pink-400 text-white py-1 px-3 rounded-full text-sm flex items-center gap-1"><Gift className="w-4 h-4"/> Claim 50 pts</button>
                </div>
              </div>
            </div>
          </div>

          {/* Earn More / Refer sections */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            <div className="md:col-span-7 bg-white rounded-lg p-4 shadow">
              <h4 className="font-medium">Refer and win 10,000 points!</h4>
              <p className="text-sm text-slate-500 mt-1">Invite 3 friends and earn points when they join.</p>
            </div>
            <div className="md:col-span-5 bg-white rounded-lg p-4 shadow">
              <h4 className="font-medium">Share Your Stack</h4>
              <p className="text-sm text-slate-500 mt-1">Share your tool stack — earn +25 pts</p>
              <div className="mt-2 text-right"><button className="px-3 py-1 bg-violet-100 text-violet-600 rounded">Share</button></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow mt-4">
            <div className="bg-violet-50 p-3 rounded mb-3">Share Your Link — Invite friends and earn 25 points when they join!</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="text-center"><div className="text-2xl font-bold text-violet-600">0</div><div className="text-sm text-slate-500">Referrals</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-violet-600">0</div><div className="text-sm text-slate-500">Points Earned</div></div>
              <div><input className="w-full border rounded px-3 py-2 text-xs" value={'https://app.flowvahub.com/signup/?ref=hamma3128'} readOnly/></div>
            </div>
          </div>
        </div>
      )}

      {/* REDEEM Section */}
      {tab === TABS.REDEEM && (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-violet-500 rounded"/>
            <h3 className="text-2xl font-semibold">Redeem Your Points</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['all','unlocked','locked','coming'].map(f=>(
              <button key={f} onClick={()=>setRedeemFilter(f)} className={`px-3 py-1 text-sm ${redeemFilter===f?'bg-violet-50 text-violet-700 border-b-2 border-violet-500':'text-slate-500'}`}>{f.charAt(0).toUpperCase()+f.slice(1)} <span className="ml-2 inline-block bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 text-xs">{counts[f]}</span></button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {filteredRewards.map(r => <RewardCard key={r.id} reward={r} onRedeem={()=>alert('Redeem: '+r.title)} userPoints={userPoints} loading={redeemLoading}/>)}
          </div>
        </div>
      )}

      {/* Modals */}
      {showClaimModal && (
        <Modal title={"Level Up! 🎉"} onClose={()=>setShowClaimModal(false)}>
          <div className="text-3xl font-extrabold text-violet-600">+5 Points</div>
          <div className="flex justify-center space-x-2 mb-1 text-sm">
            <span className="animate-bounce-updown">✨</span>
            <span className="animate-bounce-updown">💎</span>
            <span className="animate-bounce-updown">🎯</span>
        </div>

          <p className="mt-2 text-sm text-slate-600">You've claimed your daily points! Come back tomorrow for more!</p>
        </Modal>
      )}
    {showClaim50Modal && (
    <ClaimUploadModal
      points={50}
      onClose={() => setShowClaim50Modal(false)}
      onSubmitted={() => {
        setShowClaim50Modal(false)
        toast.success('Your claim was submitted successfully ✅')
      }}
    />
)}

    </div>
  )
}

export default Rewards
