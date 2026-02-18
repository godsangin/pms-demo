import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getActiveRole } from '@/shared/lib/role'

export function RequireExec({ children }: PropsWithChildren) {
  const role = getActiveRole()
  const location = useLocation()

  if (role !== 'EXEC') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
