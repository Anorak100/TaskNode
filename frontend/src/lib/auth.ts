const API_BASE_URL = "http://localhost:3000"
const TOKEN_KEY = "task-manager-token"
const USER_KEY = "task-manager-user"

export type AuthUser = {
  id: number
  email: string
  name: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  const user = localStorage.getItem(USER_KEY)
  return user ? (JSON.parse(user) as AuthUser) : null
}

export function isAuthenticated() {
  return Boolean(getStoredToken())
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Request failed")
  }

  return data as T
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await parseResponse<LoginResponse>(response)
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))

  return data
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })

  return parseResponse<{ id: number; email: string; name: string; createdAt: string }>(response)
}
