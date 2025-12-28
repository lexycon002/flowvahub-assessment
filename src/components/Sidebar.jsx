import { useEffect, useState } from "react"
import {
  Home,
  Compass,
  BookOpen,
  Layers,
  CreditCard,
  Gift,
  Menu,
  X ,
  Settings,
} from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import Flowvalogo from "../assets/flowva.png"

function Sidebar({ active = "rewards" }) {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const items = [
    { key: "home", label: "Home", icon: Home },
    { key: "discover", label: "Discover", icon: Compass },
    { key: "library", label: "Library", icon: BookOpen },
    { key: "stack", label: "Tech Stack", icon: Layers },
    { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { key: "rewards", label: "Rewards Hub", icon: Gift },
    { key: "settings", label: "Settings", icon: Settings },
  ]

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User"
  const email = user?.email || ""
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <>
      {/* Mobile menu toggle button - visible only on small screens */}
      <button
        className="mb-4 p-2 fixed top-4 left-4 z-20 bg-white rounded-md shadow-md md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white border-r border-slate-100 px-4 py-6 flex flex-col justify-between mt-8
          fixed top-0 left-0 min-h-screen z-10
          transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:top-0 md:left-0 md:min-h-screen
        `}
      >
        <div>
          <img src={Flowvalogo} alt="Flowva" className="w-[120px] mb-4" />

          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = item.key === active
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              )
            })}
          </nav>
        </div>

        {user && (
          <div className="relative">
            <div
              className="flex items-center gap-3 px-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center font-semibold text-violet-700">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{fullName}</div>
                <div className="text-xs text-slate-400 truncate">{email}</div>
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute bottom-14 left-0 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-10">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100">
                  Feedback
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100">
                  Support
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
