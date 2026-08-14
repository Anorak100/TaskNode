import { getStoredToken } from "@/lib/auth"
import type { TaskRecord } from "@/lib/dashboard-data"

const API_BASE_URL = "http://localhost:3000"

export type AnalyticsPeriod = 7 | 30 | 90

type ProjectRecord = {
  id: string
  name: string
  description: string | null
  icon: string
  userId: string
  createdAt: string
}

export type AnalyticsSummary = {
  totalTasks: number
  completed: number
  inProgress: number
  overdue: number
  trends: {
    totalTasks: number
    completed: number
    inProgress: number
    overdue: number
  }
}

export type CompletionTrendPoint = {
  date: string
  label: string
  count: number
}

export type ProjectPerformance = {
  id: string
  name: string
  icon: string
  progress: number
  completedTasks: number
  totalTasks: number
}

export type AnalyticsData = {
  period: AnalyticsPeriod
  summary: AnalyticsSummary
  completionTrend: CompletionTrendPoint[]
  taskStatus: {
    completed: number
    inProgress: number
    todo: number
    overdue: number
  }
  projectPerformance: ProjectPerformance[]
  upcoming: {
    today: number
    tomorrow: number
    thisWeek: number
    overdue: number
  }
  activityHeatmap: {
    weeks: { label: string; days: { date: string; count: number }[] }[]
    maxCount: number
  }
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

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function activityDate(task: TaskRecord) {
  // Completion activity belongs on the day the task was completed. The
  // created date remains a fallback for tasks created before completedAt was
  // introduced.
  return task.status === "DONE" && task.completedAt ? new Date(task.completedAt) : new Date(task.createdAt)
}

function isOverdue(task: TaskRecord, today: Date) {
  if (task.status === "DONE" || !task.dueDate) return false
  return startOfDay(new Date(task.dueDate)) < today
}

function isDueOn(task: TaskRecord, day: Date) {
  if (!task.dueDate || task.status === "DONE") return false
  return startOfDay(new Date(task.dueDate)).getTime() === startOfDay(day).getTime()
}

function countInWindow(tasks: TaskRecord[], start: Date, end: Date) {
  return tasks.filter((task) => {
    const created = startOfDay(new Date(task.createdAt))
    return created >= start && created <= end
  })
}

function summarizeTasks(tasks: TaskRecord[], today: Date) {
  const completed = tasks.filter((t) => t.status === "DONE").length
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length
  const todo = tasks.filter((t) => t.status === "TODO").length
  const overdue = tasks.filter((t) => isOverdue(t, today)).length

  return { totalTasks: tasks.length, completed, inProgress, overdue, todo }
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return Math.round(((current - previous) / previous) * 100)
}

function buildCompletionTrend(tasks: TaskRecord[], periodStart: Date, periodEnd: Date): CompletionTrendPoint[] {
  const days: CompletionTrendPoint[] = []
  const totalDays = Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))

  for (let i = 0; i <= totalDays; i++) {
    const day = addDays(periodStart, i)
    const dayEnd = addDays(day, 1)
    const count = tasks.filter((task) => {
      if (task.status !== "DONE") return false
      const completed = activityDate(task)
      return completed >= day && completed < dayEnd
    }).length

    days.push({
      date: day.toISOString(),
      label: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(day),
      count,
    })
  }

  return days
}

function buildActivityHeatmap(tasks: TaskRecord[]) {
  const today = startOfDay(new Date())
  const weeks: { label: string; days: { date: string; count: number }[] }[] = []
  // Start every column on Monday so the row labels (Mon–Sun) always match the
  // actual weekday. The final column contains the current week.
  const mondayOffset = (today.getDay() + 6) % 7
  const currentWeekStart = addDays(today, -mondayOffset)
  const heatStart = addDays(currentWeekStart, -(26 - 1) * 7)
  let maxCount = 0

  const counts = new Map<string, number>()
  tasks.forEach((task) => {
    const key = localDateKey(startOfDay(activityDate(task)))
    counts.set(key, (counts.get(key) || 0) + 1)
    maxCount = Math.max(maxCount, counts.get(key) || 0)
  })

  for (let week = 0; week < 26; week++) {
    const weekStart = addDays(heatStart, week * 7)
    const label =
      week === 0 || weekStart.getDate() <= 7
        ? new Intl.DateTimeFormat("en", { month: "short" }).format(weekStart)
        : ""

    const days = []
    for (let day = 0; day < 7; day++) {
      const current = addDays(weekStart, day)
      const key = localDateKey(current)
      const count = counts.get(key) || 0
      days.push({ date: key, count })
    }

    weeks.push({ label, days })
  }

  return { weeks, maxCount: Math.max(maxCount, 1) }
}

export async function getAnalyticsData(period: AnalyticsPeriod = 30): Promise<AnalyticsData> {
  const projects = await fetchJson<ProjectRecord[]>("/api/projects")
  const projectTaskSets = await Promise.all(
    projects.map(async (project) => {
      const tasks = await fetchJson<TaskRecord[]>(`/api/projects/${project.id}/tasks`)
      return { project, tasks }
    })
  )

  const allTasks = projectTaskSets.flatMap(({ tasks }) => tasks)
  const today = startOfDay(new Date())
  const periodEnd = today
  const periodStart = addDays(today, -(period - 1))
  const previousEnd = addDays(periodStart, -1)
  const previousStart = addDays(previousEnd, -(period - 1))

  const currentTasks = countInWindow(allTasks, periodStart, periodEnd)
  const previousTasks = countInWindow(allTasks, previousStart, previousEnd)

  const currentSummary = summarizeTasks(currentTasks, today)
  const previousSummary = summarizeTasks(previousTasks, today)

  const activeTasks = allTasks.filter((task) => task.status !== "DONE" && task.dueDate)
  const endOfWeek = addDays(today, 6)

  const upcoming = {
    today: activeTasks.filter((task) => isDueOn(task, today)).length,
    tomorrow: activeTasks.filter((task) => isDueOn(task, addDays(today, 1))).length,
    thisWeek: activeTasks.filter((task) => {
      const due = startOfDay(new Date(task.dueDate!))
      return due >= today && due <= endOfWeek
    }).length,
    overdue: allTasks.filter((task) => isOverdue(task, today)).length,
  }

  const projectPerformance: ProjectPerformance[] = projectTaskSets
    .map(({ project, tasks }) => {
      const completedTasks = tasks.filter((t) => t.status === "DONE").length
      const totalTasks = tasks.length
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
      return {
        id: project.id,
        name: project.name,
        icon: project.icon,
        progress,
        completedTasks,
        totalTasks,
      }
    })
    .sort((a, b) => b.progress - a.progress)

  const completionTrend = buildCompletionTrend(currentTasks, periodStart, periodEnd)

  return {
    period,
    summary: {
      totalTasks: currentSummary.totalTasks,
      completed: currentSummary.completed,
      inProgress: currentSummary.inProgress,
      overdue: currentSummary.overdue,
      trends: {
        totalTasks: percentChange(currentSummary.totalTasks, previousSummary.totalTasks),
        completed: percentChange(currentSummary.completed, previousSummary.completed),
        inProgress: percentChange(currentSummary.inProgress, previousSummary.inProgress),
        overdue: percentChange(currentSummary.overdue, previousSummary.overdue),
      },
    },
    completionTrend,
    taskStatus: {
      completed: currentSummary.completed,
      inProgress: currentSummary.inProgress,
      todo: currentSummary.todo,
      overdue: currentSummary.overdue,
    },
    projectPerformance,
    upcoming,
    activityHeatmap: buildActivityHeatmap(allTasks),
  }
}

export const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  7: "Last 7 Days",
  30: "Last 30 Days",
  90: "Last 90 Days",
}
