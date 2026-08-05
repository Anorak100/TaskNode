import { Bell, Menu, Search, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
          {/* Can put a breadcrumb or title here if needed */}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="relative w-full max-w-[12rem] sm:max-w-[14rem] md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-full border-transparent bg-secondary/50 pl-9 focus-visible:bg-background focus-visible:ring-primary"
          />
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button
          className="hidden h-9 gap-2 rounded-full px-4 font-medium sm:inline-flex"
          onClick={() => navigate("/projects/new")}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">New Project</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full sm:hidden"
          aria-label="Create new project"
          onClick={() => navigate("/projects/new")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
