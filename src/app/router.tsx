import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'

import { RequireExec } from '@/app/security/RequireExec'
import { ExecutiveLayout } from '@/layouts/executive/ExecutiveLayout'
import { ExecDashboardPage } from '@/pages/exec/ExecDashboardPage'
import { ExecProjectDetailPage } from '@/pages/exec/ExecProjectDetailPage'
import { ExecRisksBoardPage } from '@/pages/exec/ExecRisksBoardPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { getActiveRole } from '@/shared/lib/role'

function DefaultRedirect() {
  const role = getActiveRole()
  return <Navigate to={(role === 'ADMIN' || role === 'USER' || role === 'EXEC') ? '/exec' : '/login'} replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/exec"
          element={
            <RequireExec>
              <ExecutiveLayout />
            </RequireExec>
          }
        >
          <Route index element={<ExecDashboardPage />} />
          <Route path="risks" element={<ExecRisksBoardPage />} />
          <Route path="projects/:projectId" element={<ExecProjectDetailPage />} />
        </Route>

        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
