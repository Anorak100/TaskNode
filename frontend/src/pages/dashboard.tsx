import { useEffect, useMemo, useState } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ProjectCard } from "@/components/dashboard/project-card"
import { getStoredUser } from "@/lib/auth"
import { getDashboardData, type DashboardStats } from "@/lib/dashboard-data"
import { FileText, CheckCircle2, LayoutTemplate, CalendarClock, Plane, BookOpen, Code2, Briefcase } from "lucide-react"

const iconPalette = [
  { icon: <LayoutTemplate className="w-5 h-5" />, iconBg: "bg-blue-500" },
  { icon: <BookOpen className="w-5 h-5" />, iconBg: "bg-emerald-500" },
  { icon: <Briefcase className="w-5 h-5" />, iconBg: "bg-purple-500" },
  { icon: <CheckCircle2 className="w-5 h-5" />, iconBg: "bg-amber-500" },
  { icon: <Code2 className="w-5 h-5" />, iconBg: "bg-rose-500" },
  { icon: <Plane className="w-5 h-5" />, iconBg: "bg-cyan-500" },
]

export function Dashboard() {
  const user = getStoredUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const displayName = user?.name || "there"

  useEffect(() => {
    getDashboardData()
      .then(setStats)
      .catch((requestError: Error) => setError(requestError.message))
  }, [])

  const completionRate = useMemo(() => {
    if (!stats || stats.totalTasks === 0) return 0
    return Math.round((stats.completedTasks / stats.totalTasks) * 100)
  }, [stats])

  return (
    <div className="max-w-6xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{greeting}, {displayName} 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
      </div>

      {error ? <p className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects ?? 0}
          icon={FileText}
          iconBgColor="bg-blue-100 dark:bg-blue-900/40"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: "Live", positive: true, label: "from your workspace" }}
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks ?? 0}
          icon={LayoutTemplate}
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend={{ value: "Tracked", positive: true, label: "across all projects" }}
        />
        <StatCard
          title="Tasks Due Today"
          value={stats?.tasksDueToday ?? 0}
          icon={CalendarClock}
          iconBgColor="bg-amber-100 dark:bg-amber-900/40"
          iconColor="text-amber-600 dark:text-amber-400"
          trend={{ value: "Watchlist", positive: true, label: "high priority" }}
        />
        <StatCard
          title="Completed Tasks"
          value={`${completionRate}%`}
          icon={CheckCircle2}
          iconBgColor="bg-purple-100 dark:bg-purple-900/40"
          iconColor="text-purple-600 dark:text-purple-400"
          trend={{ value: `${stats?.completedTasks ?? 0}`, positive: true, label: "completed" }}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Projects</h2>
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
          <button className="hover:text-foreground transition-colors">All Projects ˅</button>
          <button className="hover:text-foreground transition-colors">Sort: Recent</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(stats?.projects ?? []).map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.name}
            description={project.description}
            icon={iconPalette[index % iconPalette.length].icon}
            iconBg={iconPalette[index % iconPalette.length].iconBg}
            progress={project.progress}
            tasksCount={project.tasksCount}
            dueDate={project.dueDate}
            priority={project.priority}
          />
        ))}
      </div>
    </div>
  )
}
