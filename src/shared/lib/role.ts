import { clearStoredToken } from './storage'
import type { Role, User } from '../types/pms'

const ROLE_KEY = 'pms-demo-role'
const USER_KEY = 'pms-demo-user'

export function getActiveRole(): Role | undefined {
  const raw = window.localStorage.getItem(ROLE_KEY)
  if (raw === 'ADMIN' || raw === 'USER' || raw === 'EXEC') return raw as Role
  return undefined
}

export function setActiveRole(role: Role) {
  window.localStorage.setItem(ROLE_KEY, role)
}

export function clearActiveRole() {
  window.localStorage.removeItem(ROLE_KEY)
  window.localStorage.removeItem(USER_KEY)
  clearStoredToken()
}

export function getCurrentUser(): User | undefined {
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as User
  } catch {
    return undefined
  }
}

export function setCurrentUser(user: User) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  setActiveRole(user.role)
}
