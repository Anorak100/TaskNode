import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <button
        type="button"
        aria-label="Close mobile navigation"
        className={`fixed inset-0 z-30 bg-background/60 backdrop-blur-sm transition-opacity md:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen md:ml-64">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden p-4 pb-12 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
