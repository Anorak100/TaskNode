import { getStoredToken } from "@/lib/auth"

const API_BASE_URL = "http://localhost:3000"
const READ_IDS_KEY = "tasknode-notification-read-ids"

type ProjectRecord = {
  id: string
  name: string
  icon: string
}

type TaskRecord = {
  id: string
  title: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  dueDate: string | null
  projectId: string
}

export type NotificationType =
  | "task_overdue"
  | "task_due_today"
  | "task_due_soon"
  | "project_upcoming"
  | "project_completed"

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  href: string
  priority: "high" | "medium" | "low"
  createdAt: string
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

function daysUntil(dueDate: string, today: Date) {
  const due = startOfDay(new Date(dueDate))
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDueLabel(dueDate: string) {
  const diff = daysUntil(dueDate, startOfDay(new Date()))
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`
  if (diff === 0) return "due today"
  if (diff === 1) return "due tomorrow"
  return `due in ${diff} days`
}

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]))
}

export function markNotificationRead(id: string) {
  const ids = getReadIds()
  ids.add(id)
  saveReadIds(ids)
}

export function markAllNotificationsRead(notificationIds: string[]) {
  const ids = getReadIds()
  notificationIds.forEach((id) => ids.add(id))
  saveReadIds(ids)
}

export function isNotificationRead(id: string) {
  return getReadIds().has(id)
}

export async function getNotifications(): Promise<AppNotification[]> {
  const projects = await fetchJson<ProjectRecord[]>("/api/projects")
  const projectTaskSets = await Promise.all(
    projects.map(async (project) => {
      const tasks = await fetchJson<TaskRecord[]>(`/api/projects/${project.id}/tasks`)
      return { project, tasks }
    })
  )

  const today = startOfDay(new Date())
  const notifications: AppNotification[] = []

  for (const { project, tasks } of projectTaskSets) {
    const activeTasks = tasks.filter((task) => task.status !== "DONE")
    const completedCount = tasks.filter((task) => task.status === "DONE").length
    const total = tasks.length
    const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100)

    if (total > 0 && progress === 100) {
      notifications.push({
        id: `project-completed-${project.id}`,
        type: "project_completed",
        title: "Project completed",
        message: `"${project.name}" is fully complete — all ${total} tasks finished.`,
        href: `/projects/${project.id}/tasks`,
        priority: "low",
        createdAt: new Date().toISOString(),
      })
    }

    const overdueTasks = activeTasks.filter(
      (task) => task.dueDate && daysUntil(task.dueDate, today) < 0
    )
    const dueTodayTasks = activeTasks.filter(
      (task) => task.dueDate && daysUntil(task.dueDate, today) === 0
    )
    const dueSoonTasks = activeTasks.filter((task) => {
      if (!task.dueDate) return false
      const diff = daysUntil(task.dueDate, today)
      return diff > 0 && diff <= 7
    })

    for (const task of overdueTasks) {
      notifications.push({
        id: `task-overdue-${task.id}`,
        type: "task_overdue",
        title: "Overdue task",
        message: `"${task.title}" in ${project.name} is ${formatDueLabel(task.dueDate!)}.`,
        href: `/projects/${project.id}/tasks`,
        priority: "high",
        createdAt: task.dueDate!,
      })
    }

    for (const task of dueTodayTasks) {
      notifications.push({
        id: `task-today-${task.id}`,
        type: "task_due_today",
        title: "Task due today",
        message: `"${task.title}" in ${project.name} is due today.`,
        href: `/projects/${project.id}/tasks`,
        priority: "high",
        createdAt: today.toISOString(),
      })
    }

    for (const task of dueSoonTasks) {
      notifications.push({
        id: `task-soon-${task.id}`,
        type: "task_due_soon",
        title: "Upcoming task",
        message: `"${task.title}" in ${project.name} is ${formatDueLabel(task.dueDate!)}.`,
        href: `/projects/${project.id}/tasks`,
        priority: "medium",
        createdAt: task.dueDate!,
      })
    }

    const upcomingProjectTasks = [...dueTodayTasks, ...dueSoonTasks]
    if (upcomingProjectTasks.length >= 2) {
      const earliest = upcomingProjectTasks
        .filter((t) => t.dueDate)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0]

      notifications.push({
        id: `project-upcoming-${project.id}`,
        type: "project_upcoming",
        title: "Project deadline approaching",
        message: `"${project.name}" has ${upcomingProjectTasks.length} tasks coming up${
          earliest?.dueDate ? ` — next ${formatDueLabel(earliest.dueDate)}` : ""
        }.`,
        href: `/projects/${project.id}/tasks`,
        priority: "medium",
        createdAt: earliest?.dueDate ?? today.toISOString(),
      })
    }
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return notifications.sort((a, b) => {
    const byPriority = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (byPriority !== 0) return byPriority
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function getUnreadCount(notifications: AppNotification[]) {
  const readIds = getReadIds()
  return notifications.filter((n) => !readIds.has(n.id)).length
}
