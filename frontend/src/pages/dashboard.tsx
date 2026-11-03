import { useEffect, useMemo, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/dashboard/stat-card"
import { ProjectCard } from "@/components/dashboard/project-card"
import { getStoredUser } from "@/lib/auth"
import { getDashboardData, type DashboardStats } from "@/lib/dashboard-data"
import { updateProject, deleteProject } from "@/lib/projects"
import { AlertTriangle, FileText, CheckCircle2, LayoutTemplate, CalendarClock, X } from "lucide-react"
import { PROJECT_ICONS, getProjectIcon } from "@/lib/icons"

export function Dashboard() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<{ id: string; name: string; description: string; icon: string } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
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

  const handleDeleteProject = (projectId: string, projectName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPendingDelete({ id: projectId, name: projectName })
  }

  const confirmDeleteProject = async () => {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await deleteProject(pendingDelete.id)
      const newData = await getDashboardData()
      setStats(newData)
      setPendingDelete(null)
    } catch (err: any) {
      setError(err.message || "Failed to delete project")
    } finally {
      setIsDeleting(false)
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
        icon: editingProject.icon,
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
        {(stats?.projects ?? []).map((project) => {
          const projectIcon = getProjectIcon(project.icon)
          const IconComp = projectIcon.icon
          return (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              icon={<IconComp className="w-5 h-5" />}
              iconBg={projectIcon.bg}
              progress={project.progress}
              tasksCount={project.tasksCount}
              dueDate={project.dueDate}
              priority={project.priority}
              onClick={() => navigate(`/projects/${project.id}/tasks`)}
              onDelete={(e) => handleDeleteProject(project.id, project.name, e)}
              onEdit={(e) => {
                e.stopPropagation()
                setEditingProject({ id: project.id, name: project.name, description: project.description || "", icon: project.icon || "layout" })
              }}
            />
          )
        })}
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
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Project Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {PROJECT_ICONS.map((icon) => {
                    const IconComponent = icon.icon
                    const isSelected = editingProject.icon === icon.id
                    return (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() => setEditingProject(c => c ? { ...c, icon: icon.id } : null)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                          isSelected
                            ? `${icon.bg} text-white shadow-md scale-110`
                            : `bg-slate-50 text-slate-400 hover:text-slate-600 dark:bg-slate-900 ${icon.hover}`
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </button>
                    )
                  })}
                </div>
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

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm animate-in fade-in"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setPendingDelete(null)
          }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setPendingDelete(null)}
              disabled={isDeleting}
              aria-label="Close delete project dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="pr-6">
                <h2 id="delete-project-title" className="text-xl font-bold">Delete project?</h2>
                <p id="delete-project-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  You’re about to delete <span className="font-semibold text-foreground">{pendingDelete.name}</span>. All tasks in this project will be permanently removed.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setPendingDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" className="flex-1" onClick={confirmDeleteProject} disabled={isDeleting}>
                {isDeleting ? "Deleting…" : "Delete project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
