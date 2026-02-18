export type Role = 'EXEC' | 'PM' | 'MEMBER'

const ROLE_KEY = 'pms-demo-role'

export function getActiveRole(): Role | undefined {
  const raw = window.localStorage.getItem(ROLE_KEY)
  if (raw === 'EXEC' || raw === 'PM' || raw === 'MEMBER') return raw
  return undefined
}

export function setActiveRole(role: Role) {
  window.localStorage.setItem(ROLE_KEY, role)
}

export function clearActiveRole() {
  window.localStorage.removeItem(ROLE_KEY)
}
