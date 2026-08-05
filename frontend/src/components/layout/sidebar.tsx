import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  BarChart3,
  Settings,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FolderKanban, label: "Projects", active: false },
    { icon: CalendarDays, label: "Calendar", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r bg-background transition-transform duration-300 md:w-64",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="mt-2 flex h-16 items-center justify-between border-b border-transparent px-4 md:px-6">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-white/95 px-2 py-1.5 shadow-sm shadow-primary/5 dark:bg-slate-950/80 dark:shadow-none">
            <img src="/tasknode_3.png" alt="TaskNode Logo" className="h-8 w-auto" />
            <div className="flex items-center text-[0.95rem] font-semibold tracking-tight">
              <span className="text-black dark:text-white">task</span>
              <span className="text-blue-600">node</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 transition-colors hover:bg-secondary md:hidden"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
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

      <div className="mt-auto flex flex-col gap-4 border-t p-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-muted-foreground">Dark mode</span>
          <ThemeToggle />
        </div>
        <div className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="h-9 w-9 rounded-full" />
          <div className="flex flex-col text-left">
            <span className="mb-1 text-sm font-semibold leading-none">Israel Akoteyon</span>
            <span className="text-xs leading-none text-muted-foreground">israel@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
