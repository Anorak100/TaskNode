import { getStoredToken } from "@/lib/auth"

const API_BASE_URL = "http://localhost:3000"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"

export type ProjectRecord = {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
}

export type TaskRecord = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string | null
  projectId: string
  createdAt: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Request failed")
  }

  return data as T
}

export async function getProject(projectId: string) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  return parseResponse<ProjectRecord>(response)
}

export async function getProjectTasks(projectId: string) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tasks`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  return parseResponse<TaskRecord[]>(response)
}

export async function getAllTasks() {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  return parseResponse<(TaskRecord & { project?: { name: string } })[]>(response)
}


export async function createTask(projectId: string, payload: { title: string; description?: string; status?: TaskStatus; dueDate?: string }) {
  const token = getStoredToken()
  if (!token) {
    throw new Error("You must be signed in to create a task")
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<TaskRecord>(response)
}

export async function updateTask(taskId: string, updates: Partial<{ title: string; description: string | null; status: TaskStatus; dueDate: string | null }>) {
  const token = getStoredToken()
  if (!token) {
    throw new Error("You must be signed in to update a task")
  }

  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  return parseResponse<TaskRecord>(response)
}

export async function deleteTask(taskId: string) {
  const token = getStoredToken()
  if (!token) {
    throw new Error("You must be signed in to delete a task")
  }

  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseResponse<void>(response)
}
