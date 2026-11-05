const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const ADMIN_TOKEN_KEY = "tasknode-admin-token"
const ADMIN_EMAIL_KEY = "tasknode-admin-email"
export const ADMIN_AUTH_EXPIRED_EVENT = "tasknode:admin-auth-expired"

type AdminLoginResponse = {
  token: string
  admin: { email: string }
}

export type AdminOverview = {
  users: number
  projects: number
  tasks: number
  tasksByStatus: Record<string, number>
}

export type AdminUser = {
  id: string
  email: string
  name: string
  createdAt: string
  projectCount: number
  taskCount: number
}

export type AdminUsersResponse = {
  users: AdminUser[]
  page: number
  pageSize: number
  totalUsers: number
  totalPages: number
}

function hasValidToken(token: string) {
  try {
    const payloadSegment = token.split(".")[1]
    if (!payloadSegment) return false
    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const payload = JSON.parse(atob(padded)) as { exp?: unknown; role?: unknown }
    return payload.role === "admin"
      && typeof payload.exp === "number"
      && Number.isFinite(payload.exp)
      && Date.now() < payload.exp * 1000
  } catch {
    return false
  }
}

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function getAdminEmail() {
  return sessionStorage.getItem(ADMIN_EMAIL_KEY)
}

export function isAdminAuthenticated() {
  const token = getAdminToken()
  return Boolean(token && hasValidToken(token))
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_EMAIL_KEY)
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Request failed")
  }
  return data as T
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseResponse<AdminLoginResponse>(response)
  sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token)
  sessionStorage.setItem(ADMIN_EMAIL_KEY, data.admin.email)
}

export async function adminFetch<T>(path: string): Promise<T> {
  const token = getAdminToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (response.status === 401 || response.status === 403) {
    logoutAdmin()
    window.dispatchEvent(new Event(ADMIN_AUTH_EXPIRED_EVENT))
  }
  return parseResponse<T>(response)
}

export async function getAdminOverview() {
  return adminFetch<AdminOverview>("/api/admin/overview")
}

export async function getAdminUsers(query: string, page: number) {
  const params = new URLSearchParams({ q: query, page: String(page), pageSize: "20" })
  return adminFetch<AdminUsersResponse>(`/api/admin/users?${params}`)
}
