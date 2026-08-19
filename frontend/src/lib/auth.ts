const API_BASE_URL = "http://localhost:3000"
const TOKEN_KEY = "task-manager-token"
const USER_KEY = "task-manager-user"
const SESSION_TOKEN_KEY = "task-manager-session-token"
const SESSION_USER_KEY = "task-manager-session-user"

export type AuthUser = {
  id: number
  email: string
  name: string
  avatar?: string | null
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export function getGeneratedAvatarUrl(email: string) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email || "tasknode")}`
}

function readStorageValue(storage: Storage, key: string) {
  return storage.getItem(key)
}

export function getStoredToken() {
  const localToken = readStorageValue(localStorage, TOKEN_KEY)
  if (localToken) return localToken

  return readStorageValue(sessionStorage, SESSION_TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  const localUser = readStorageValue(localStorage, USER_KEY)
  if (localUser) {
    const user = JSON.parse(localUser) as AuthUser
    return { ...user, avatar: user.avatar || getGeneratedAvatarUrl(user.email) }
  }

  const sessionUser = readStorageValue(sessionStorage, SESSION_USER_KEY)
  if (!sessionUser) return null

  const user = JSON.parse(sessionUser) as AuthUser
  return { ...user, avatar: user.avatar || getGeneratedAvatarUrl(user.email) }
}

export function isAuthenticated() {
  return Boolean(getStoredToken())
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
  sessionStorage.removeItem(SESSION_USER_KEY)
}

function persistAuthSession(token: string, user: AuthUser, rememberMe = true) {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    sessionStorage.removeItem(SESSION_TOKEN_KEY)
    sessionStorage.removeItem(SESSION_USER_KEY)
    return
  }

  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
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

export async function loginUser(email: string, password: string, rememberMe = true) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await parseResponse<LoginResponse>(response)
  persistAuthSession(data.token, data.user, rememberMe)

  return data
}

export async function updateCurrentUserProfile(profile: { name?: string }, rememberMe = Boolean(localStorage.getItem(TOKEN_KEY))) {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getStoredToken()}`,
    },
    body: JSON.stringify(profile),
  })

  const data = await parseResponse<LoginResponse>(response)
  const user = { ...data.user, avatar: data.user.avatar || getGeneratedAvatarUrl(data.user.email) }
  persistAuthSession(data.token, user, rememberMe)

  return { ...data, user }
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

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  return parseResponse<{ message: string }>(response)
}

export async function resetPassword(email: string, code: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password }),
  })

  return parseResponse<{ message: string }>(response)
}
