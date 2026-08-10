import { useEffect, useMemo, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/dashboard/stat-card"
import { ProjectCard } from "@/components/dashboard/project-card"
import { getStoredUser } from "@/lib/auth"
import { getDashboardData, type DashboardStats } from "@/lib/dashboard-data"
import { updateProject, deleteProject } from "@/lib/projects"
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
  const navigate = useNavigate()
  const user = getStoredUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<{ id: string; name: string; description: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const displayName = user?.name || "there"
  const location = useLocation()

  useEffect(() => {
    if (location.hash === "#projects-section") {
      setTimeout(() => {
        document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [location.hash, stats])

  useEffect(() => {
    getDashboardData()
      .then(setStats)
      .catch((requestError: Error) => setError(requestError.message))
  }, [])

  const completionRate = useMemo(() => {
    if (!stats || stats.totalTasks === 0) return 0
    return Math.round((stats.completedTasks / stats.totalTasks) * 100)
  }, [stats])

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this project? All tasks inside it will be lost.")) return
    
    try {
      await deleteProject(projectId)
      const newData = await getDashboardData()
      setStats(newData)
    } catch (err: any) {
      setError(err.message || "Failed to delete project")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    setIsSubmitting(true)
    try {
      await updateProject(editingProject.id, {
        name: editingProject.name,
        description: editingProject.description,
      })
      setEditingProject(null)
      const newData = await getDashboardData()
      setStats(newData)
    } catch (err: any) {
      setError(err.message || "Failed to update project")
    } finally {
      setIsSubmitting(false)
    }
  }

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

      <div id="projects-section" className="flex items-center justify-between mb-6 scroll-mt-24">
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
            onClick={() => navigate(`/projects/${project.id}/tasks`)}
            onDelete={(e) => handleDeleteProject(project.id, e)}
            onEdit={(e) => {
              e.stopPropagation()
              setEditingProject({ id: project.id, name: project.name, description: project.description || "" })
            }}
          />
        ))}
      </div>

      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-xl font-bold">Edit Project</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={editingProject.name}
                  onChange={(e) => setEditingProject(c => c ? { ...c, name: e.target.value } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject(c => c ? { ...c, description: e.target.value } : null)}
                  className="min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingProject(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
