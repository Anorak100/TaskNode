import { getStoredToken } from "@/lib/auth"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export type ProjectRecord = {
  id: string
  name: string
  description: string | null
  icon: string
  userId: string
  createdAt: string
}

export type TaskRecord = {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "DONE"
  dueDate: string | null
  projectId: string
  createdAt: string
  completedAt: string | null
}

export type DashboardProjectSummary = {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  tasksCount: number
  dueDate: string
  priority: "high" | "medium" | "low"
}

export type DashboardStats = {
  totalProjects: number
  totalTasks: number
  tasksDueToday: number
  completedTasks: number
  projects: DashboardProjectSummary[]
}

async function fetchJson<T>(path: string): Promise<T> {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Request failed")
  }

  return data as T
}

function formatDueDate(value: string | null) {
  if (!value) return ""

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function resolvePriority(tasks: TaskRecord[]) {
  const dueTasks = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      ...task,
      dueDate: new Date(task.dueDate as string),
    }))
    .sort((a, b) => Number(a.dueDate) - Number(b.dueDate))

  if (!dueTasks.length) return "low"

  const earliest = dueTasks[0].dueDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysUntil = Math.ceil((earliest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil <= 1) return "high"
  if (daysUntil <= 4) return "medium"
  return "low"
}

export async function getDashboardData(): Promise<DashboardStats> {
  const projects = await fetchJson<ProjectRecord[]>("/api/projects")

  const projectTaskSets = await Promise.all(
    projects.map(async (project) => {
      const tasks = await fetchJson<TaskRecord[]>(`/api/projects/${project.id}/tasks`)
      return { project, tasks }
    })
  )

  const allTasks = projectTaskSets.flatMap(({ tasks }) => tasks)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tasksDueToday = allTasks.filter((task) => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  }).length

  const completedTasks = allTasks.filter((task) => task.status === "DONE").length

  const summaries: DashboardProjectSummary[] = projectTaskSets.map(({ project, tasks }) => {
    const completed = tasks.filter((task) => task.status === "DONE").length
    const total = tasks.length
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100)
    // When there are no tasks, leave the project due date blank.
    // Otherwise, find the farthest (latest) due date among the project's tasks.
    const dueTasks = tasks.filter((task) => task.dueDate)
    const latestDue = dueTasks.length
      ? dueTasks.reduce((max, t) => {
          const d = new Date(t.dueDate as string)
          return d > max ? d : max
        }, new Date(dueTasks[0].dueDate as string))
      : null

    return {
      id: project.id,
      name: project.name,
      description: project.description || "No description yet.",
      icon: project.icon,
      progress,
      tasksCount: total,
      dueDate: total === 0 ? "" : formatDueDate(latestDue ? latestDue.toISOString() : null),
      priority: resolvePriority(tasks),
    }
  })

  return {
    totalProjects: projects.length,
    totalTasks: allTasks.length,
    tasksDueToday,
    completedTasks,
    projects: summaries,
  }
}
