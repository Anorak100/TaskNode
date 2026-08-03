import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { KanbanBoard } from '@/components/kanban-board'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">TaskMaster</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content (Trello-style Kanban Board) */}
        <main className="container mx-auto px-4 py-6 h-[calc(100vh-3.5rem)]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Board</h2>
            </div>
            
            <KanbanBoard />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
