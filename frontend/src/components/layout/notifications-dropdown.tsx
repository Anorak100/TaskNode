import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock,
  FolderKanban,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  getUnreadCount,
  isNotificationRead,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
  type NotificationType,
} from "@/lib/notifications"

const TYPE_META: Record<
  NotificationType,
  { icon: React.ElementType; iconBg: string; iconColor: string }
> = {
  task_overdue: {
    icon: AlertCircle,
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
  task_due_today: {
    icon: CalendarClock,
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  task_due_soon: {
    icon: Clock,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  project_upcoming: {
    icon: FolderKanban,
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  project_completed: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
}

function formatTimeAgo(value: string) {
  const date = new Date(value)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date)
}

export function NotificationsDropdown() {
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setReadVersion] = useState(0)

  const loadNotifications = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getNotifications()
      setNotifications(data)
      setUnreadCount(getUnreadCount(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = window.setInterval(loadNotifications, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (open) loadNotifications()
  }, [open])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const handleNotificationClick = (notification: AppNotification) => {
    markNotificationRead(notification.id)
    setUnreadCount(getUnreadCount(notifications))
    setReadVersion((v) => v + 1)
    setOpen(false)
    navigate(notification.href)
  }

  const handleMarkAllRead = () => {
    markAllNotificationsRead(notifications.map((n) => n.id))
    setUnreadCount(0)
    setReadVersion((v) => v + 1)
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-muted-foreground">Tasks, deadlines, and project updates</p>
            </div>
            {unreadCount > 0 ? (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            ) : null}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading notifications...
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center text-sm text-destructive">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-medium">You&apos;re all caught up</p>
                <p className="mt-1 text-sm text-muted-foreground">No upcoming deadlines or project updates right now.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {notifications.map((notification) => {
                  const meta = TYPE_META[notification.type]
                  const Icon = meta.icon
                  const isUnread = !isNotificationRead(notification.id)

                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60",
                          isUnread && "bg-primary/5"
                        )}
                      >
                        <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", meta.iconBg)}>
                          <Icon className={cn("h-4 w-4", meta.iconColor)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold leading-tight">{notification.title}</p>
                            {isUnread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{formatTimeAgo(notification.createdAt)}</p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
