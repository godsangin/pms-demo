import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getActiveRole } from '@/shared/lib/role'

export function RequireExec({ children }: PropsWithChildren) {
  const role = getActiveRole()
  const location = useLocation()

  // ADMIN과 USER 모두 대시보드 접근 가능 (데이터 필터링은 API 레이어에서 수행)
  if (role !== 'ADMIN' && role !== 'USER') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
