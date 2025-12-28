export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Full-screen purple overlay that covers the sidebar and entire viewport */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-700 to-fuchsia-500 opacity-95 z-10" />

      {/* Center the auth card above the overlay */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 py-8">
        {children}
      </div>
    </div>
  )
}
