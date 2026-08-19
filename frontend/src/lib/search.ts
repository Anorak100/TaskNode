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
  project: {
    name: string
  }
}

export type SearchResults = {
  projects: ProjectRecord[]
  tasks: TaskRecord[]
}

export async function searchWorkspace(query: string): Promise<SearchResults> {
  const token = getStoredToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Search failed")
  }

  return data as SearchResults
}
