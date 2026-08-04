import { 
  LayoutDashboard, 
  FolderKanban, 
  CalendarDays, 
  BarChart3, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FolderKanban, label: "Projects", active: false },
    { icon: CalendarDays, label: "Calendar", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background flex flex-col transition-transform">
      <div className="flex h-16 items-center px-6 border-b border-transparent mt-2">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <img src="/tasknode_2.png" alt="TaskNode Logo" className="h-8 w-auto" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              item.active 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto border-t p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-muted-foreground">Dark mode</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50 cursor-pointer">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-9 h-9 rounded-full" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold leading-none mb-1">Israel Akoteyon</span>
            <span className="text-xs text-muted-foreground leading-none">israel@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
