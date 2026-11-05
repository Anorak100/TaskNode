import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Activity, CheckCircle2, FolderKanban, LogOut, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ADMIN_AUTH_EXPIRED_EVENT,
  getAdminEmail,
  getAdminOverview,
  getAdminUsers,
  logoutAdmin,
  type AdminOverview,
  type AdminUsersResponse,
} from "@/lib/admin-auth"

const STATUS_LABELS: Record<string, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Completed",
}

function MetricCard({ label, value, icon: Icon, detail }: {
  label: string
  value: number
  icon: typeof Users
  detail: string
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div>
      </CardContent>
    </Card>
  )
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<AdminUsersResponse | null>(null)
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")
  const [page, setPage] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleExpiredAdminSession = () => navigate("/admin/login", { replace: true })
    window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, handleExpiredAdminSession)
    return () => window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, handleExpiredAdminSession)
  }, [navigate])

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError("")
    Promise.all([getAdminOverview(), getAdminUsers(submittedQuery, page)])
      .then(([overviewData, usersData]) => {
        if (!active) return
        setOverview(overviewData)
        setUsers(usersData)
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load admin data")
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [submittedQuery, page])

  function signOut() {
    logoutAdmin()
    navigate("/admin/login", { replace: true })
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setSubmittedQuery(query.trim())
  }

  const taskTotal = overview?.tasks ?? 0

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/tasknode_3.png" alt="" className="h-9 w-auto" />
            <div>
              <p className="font-semibold">TaskNode Admin</p>
              <p className="text-xs text-muted-foreground">Usage overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{getAdminEmail()}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-primary">Application insights</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground">See how many people use TaskNode and what they do most. Task titles and descriptions are not shown.</p>
        </div>

        {error ? <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div> : null}

        <section aria-label="Usage metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Registered users" value={overview?.users ?? 0} icon={Users} detail="All user accounts" />
          <MetricCard label="Projects" value={overview?.projects ?? 0} icon={FolderKanban} detail="Created across accounts" />
          <MetricCard label="Tasks created" value={taskTotal} icon={Activity} detail="Across all projects" />
          <MetricCard label="Completed tasks" value={overview?.tasksByStatus.DONE ?? 0} icon={CheckCircle2} detail="Marked as completed" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <Card className="overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="font-semibold">Users</h2>
                <p className="mt-1 text-sm text-muted-foreground">Account details and activity totals</p>
              </div>
              <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
                <div className="relative min-w-0 flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input aria-label="Search users" placeholder="Search name or email" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" />
                </div>
                <Button type="submit" variant="outline">Search</Button>
              </form>
            </div>

            {isLoading ? (
              <p role="status" className="p-8 text-center text-sm text-muted-foreground">Loading admin data...</p>
            ) : users?.users.length ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Joined</th>
                        <th className="px-5 py-3 text-right font-medium">Projects</th>
                        <th className="px-5 py-3 text-right font-medium">Tasks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-5 py-4">
                            <p className="font-medium">{user.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-right tabular-nums">{user.projectCount}</td>
                          <td className="px-5 py-4 text-right tabular-nums">{user.taskCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
                  <span className="text-muted-foreground">{users.totalUsers.toLocaleString()} user{users.totalUsers === 1 ? "" : "s"}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => current - 1)}>Previous</Button>
                    <span className="min-w-16 text-center text-xs text-muted-foreground">{users.page} / {Math.max(users.totalPages, 1)}</span>
                    <Button variant="outline" size="sm" disabled={page >= users.totalPages || isLoading} onClick={() => setPage((current) => current + 1)}>Next</Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">{submittedQuery ? "No users match that search." : "No users have registered yet."}</p>
            )}
          </Card>

          <Card className="rounded-2xl">
            <div className="p-5 sm:p-6">
              <h2 className="font-semibold">Task activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Distribution by current task status</p>
            </div>
            <CardContent className="space-y-5">
              {Object.entries(STATUS_LABELS).map(([status, label]) => {
                const count = overview?.tasksByStatus[status] ?? 0
                const percent = taskTotal ? Math.round((count / taskTotal) * 100) : 0
                return (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{label}</span>
                      <span className="tabular-nums text-muted-foreground">{count.toLocaleString()} · {percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
              {!isLoading && taskTotal === 0 ? <p className="text-xs text-muted-foreground">Task activity will appear here as users create tasks.</p> : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
