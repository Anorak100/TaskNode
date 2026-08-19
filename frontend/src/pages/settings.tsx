import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Download, Palette, Shield, Bell, UserRound, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/theme-provider"
import { getGeneratedAvatarUrl, getStoredUser, logout, updateCurrentUserProfile } from "@/lib/auth"

const notificationDefaults = {
  task_overdue: true,
  task_due_today: true,
  task_due_soon: true,
  project_upcoming: true,
  project_completed: true,
} as const

type SectionKey = "account" | "appearance" | "notifications" | "security" | "data"
type NotificationKey = keyof typeof notificationDefaults

const SECTION_META: Array<{ key: SectionKey; label: string; icon: typeof UserRound }> = [
  { key: "account", label: "Account", icon: UserRound },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "data", label: "Account & Data", icon: Sparkles },
]

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const


function readStoredNotifications() {
  const value = localStorage.getItem("tasknode-notification-preferences")
  if (!value) return { ...notificationDefaults }

  try {
    return { ...notificationDefaults, ...(JSON.parse(value) as Partial<Record<NotificationKey, boolean>>) }
  } catch {
    return { ...notificationDefaults }
  }
}

function writeStoredUser(nextUser: { name: string; email: string; avatar?: string | null }) {
  const payload = JSON.stringify(nextUser)
  localStorage.setItem("task-manager-user", payload)
  sessionStorage.setItem("task-manager-session-user", payload)
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [selectedSection, setSelectedSection] = useState<SectionKey>("account")
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" })
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({ ...notificationDefaults })

  useEffect(() => {
    const user = getStoredUser()
    setProfile({
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? getGeneratedAvatarUrl(user?.email ?? "tasknode"),
    })

    setNotifications(readStoredNotifications())
  }, [])

  useEffect(() => {
    localStorage.setItem("tasknode-notification-preferences", JSON.stringify(notifications))
  }, [notifications])

  const userInitials = useMemo(() => {
    return profile.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TN"
  }, [profile.name])

  const saveProfile = async () => {
    const trimmedName = profile.name.trim()
    if (!trimmedName) return

    try {
      const response = await updateCurrentUserProfile({
        name: trimmedName,
      })

      const nextUser = {
        ...response.user,
        email: response.user.email,
        name: response.user.name,
        avatar: response.user.avatar ?? getGeneratedAvatarUrl(response.user.email),
      }

      writeStoredUser(nextUser)
      setProfile((current) => ({
        ...current,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar ?? current.avatar,
      }))
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to save profile changes")
    }
  }

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: getStoredUser(),
      theme,
      notifications,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "tasknode-data.json"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const deleteAccount = () => {
    const confirmed = window.confirm("This will permanently delete your TaskNode account, projects, and tasks. Continue?")
    if (!confirmed) return

    logout()
    window.location.replace("/login")
  }

  const signOutAllDevices = () => {
    logout()
    sessionStorage.setItem("tasknode-sign-out-notice", "true")
    window.location.replace("/login")
  }

  const sectionContent = (() => {
    switch (selectedSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Account</h2>
                <p className="text-sm text-muted-foreground">Manage your profile details and account preferences.</p>
              </div>
            </div>

            <Card className="overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage src={profile.avatar || undefined} alt={profile.name || "User avatar"} />
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Profile picture</p>
                    <p className="text-xs text-muted-foreground">This is currently generated automatically for each account.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <Input
                      value={profile.name}
                      onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input value={profile.email} disabled className="bg-muted/30" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={saveProfile}>Save changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Password</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Use a strong password to protect your account.</p>
                </div>
                <Button type="button" variant="outline" onClick={() => window.location.assign("/forgot-password")}>Change password</Button>
              </CardContent>
            </Card>
          </div>
        )

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Appearance</h2>
              <p className="text-sm text-muted-foreground">Choose how TaskNode looks across your device.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {THEME_OPTIONS.map((option) => {
                  const isSelected = theme === option.value
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="theme"
                          checked={isSelected}
                          onChange={() => setTheme(option.value)}
                          className="h-4 w-4"
                        />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {isSelected ? <span className="text-xs font-medium text-primary">Selected</span> : null}
                    </label>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
              <p className="text-sm text-muted-foreground">Control which task and project alerts you want to see.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {Object.entries(notificationDefaults).map(([key]) => {
                  const enabled = notifications[key as NotificationKey]
                  const label =
                    key === "task_overdue"
                      ? "Task reminders"
                      : key === "task_due_today"
                        ? "Due today"
                        : key === "task_due_soon"
                          ? "Upcoming tasks"
                          : key === "project_upcoming"
                            ? "Project upcoming"
                            : "Project completed"

                  return (
                    <div key={key} className="flex items-center justify-between rounded-2xl border p-3.5">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">
                          {key === "task_overdue"
                            ? "When a task is overdue"
                            : key === "task_due_today"
                              ? "Daily due-date reminders"
                              : key === "task_due_soon"
                                ? "Tasks due soon"
                                : key === "project_upcoming"
                                  ? "Upcoming project deadlines"
                                  : "Project completion updates"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifications((current) => ({ ...current, [key]: !current[key as NotificationKey] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
                        aria-label={`Toggle ${key}`}
                      >
                        <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`} />
                      </button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Security</h2>
              <p className="text-sm text-muted-foreground">Keep your account protected and manage active sessions.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Password</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Change password</p>
                  <p className="text-sm text-muted-foreground">Update your sign-in credentials.</p>
                </div>
                <Button type="button" variant="outline" onClick={() => window.location.assign("/forgot-password")}>Change password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sessions</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Sign out from all devices</p>
                  <p className="text-sm text-muted-foreground">Ends all active sessions for your account.</p>
                </div>
                <Button type="button" variant="destructive" onClick={signOutAllDevices}>Sign out all devices</Button>
              </CardContent>
            </Card>
          </div>
        )

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Account & Data</h2>
              <p className="text-sm text-muted-foreground">Export or remove your TaskNode data.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export data</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Download a copy of your TaskNode data.</p>
                  <p className="text-sm text-muted-foreground">Includes your profile, preferences, and current settings snapshot.</p>
                </div>
                <Button type="button" variant="outline" onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export data
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Delete account
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Permanently delete your TaskNode account, projects and tasks.</p>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
                <Button type="button" variant="destructive" onClick={deleteAccount}>Delete account</Button>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  })()

  return (
    <div className="mx-auto w-full max-w-6xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <aside className="rounded-3xl border bg-card p-2 shadow-sm">
          <div className="px-2 pb-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Preferences</p>
          </div>
          <div className="space-y-1">
            {SECTION_META.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedSection(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  selectedSection === key
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${selectedSection === key ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="min-h-[600px] rounded-3xl border bg-card/60 p-4 shadow-sm sm:p-6">{sectionContent}</main>
      </div>
    </div>
  )
}
