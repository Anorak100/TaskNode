import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  BarChart3,
  Settings,
  X,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"
import { getEmailInitial, getStoredUser, logout } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FolderKanban, label: "Projects", path: "/" },
    { icon: CalendarDays, label: "Calendar", path: "/calendar" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  const isActive = (path: string, label: string) => {
    if (label === "Dashboard" && location.pathname === "/") return true
    if (label === "Projects" && location.pathname.startsWith("/projects")) return true
    if (label !== "Dashboard" && label !== "Projects" && location.pathname === path) return true
    return false
  }

  const handleSignOut = () => {
    logout()
    sessionStorage.setItem("tasknode-sign-out-notice", "true")
    window.location.replace("/login")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-[100dvh] w-72 flex-col border-r bg-background pb-[env(safe-area-inset-bottom)] transition-transform duration-300 md:w-64",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="mt-2 flex h-16 items-center justify-between border-b border-transparent px-4 md:px-6">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
          <div className="flex items-center gap-3">
            <img src="/tasknode_3.png" alt="TaskNode Logo" className="h-8 w-auto" />
            <div className="flex items-center text-[0.95rem] font-semibold tracking-tight">
              <span className="text-black dark:text-white">Task</span>
              <span className="text-blue-600">Node</span>
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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item.path, item.label)
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Projects") {
                  if (location.pathname === "/") {
                    document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" })
                    // Also update the URL hash without a full navigation so it's clean
                    window.history.pushState(null, "", "/#projects-section")
                  } else {
                    navigate("/#projects-section")
                  }
                } else {
                  navigate(item.path)
                }
                onClose?.()
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-4 border-t p-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-muted-foreground">
            {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
          </span>
          <ThemeToggle />
        </div>
        <div className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getEmailInitial(user?.email || "tasknode")}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col text-left">
            <span className="mb-1 text-sm font-semibold leading-none">{user?.name || "TaskNode User"}</span>
            <span className="truncate text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
