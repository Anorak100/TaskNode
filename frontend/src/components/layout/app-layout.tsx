import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-8 pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
