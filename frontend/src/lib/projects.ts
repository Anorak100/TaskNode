import { getStoredToken } from "@/lib/auth"

const API_BASE_URL = "http://localhost:3000"

type CreatedProject = {
  id: string
  name: string
  description: string | null
  icon: string
  userId: number
  createdAt: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Request failed")
  }

  return data as T
}

export async function createProject(name: string, description: string, icon?: string) {
  const token = getStoredToken()

  if (!token) {
    throw new Error("You must be signed in to create a project")
  }

  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description: description.trim() || undefined,
      icon,
    }),
  })

  return parseResponse<CreatedProject>(response)
}

export async function updateProject(projectId: string, updates: { name?: string; description?: string; icon?: string }) {
  const token = getStoredToken()

  if (!token) {
    throw new Error("You must be signed in to update a project")
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  return parseResponse<CreatedProject>(response)
}

export async function deleteProject(projectId: string) {
  const token = getStoredToken()

  if (!token) {
    throw new Error("You must be signed in to delete a project")
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseResponse<void>(response)
}
