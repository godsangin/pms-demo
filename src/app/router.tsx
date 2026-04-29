import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'

import { RequireExec } from '@/app/security/RequireExec'
import { ExecutiveLayout } from '@/layouts/executive/ExecutiveLayout'
import { ExecDashboardPage } from '@/pages/exec/ExecDashboardPage'
import { 
  ExecProjectDetailPage, 
  ProjectMgmtPage, 
  ProjectAnalysisPage, 
  ProjectDevPage, 
  ProjectTestPage, 
  ProjectTransitionPage 
} from '@/pages/exec/ExecProjectDetailPage'
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
          <Route path="projects/:projectId" element={<ExecProjectDetailPage />}>
            <Route index element={<Navigate to="mgmt" replace />} />
            <Route path="mgmt" element={<ProjectMgmtPage />} />
            <Route path="analysis" element={<ProjectAnalysisPage />} />
            <Route path="dev" element={<ProjectDevPage />} />
            <Route path="test" element={<ProjectTestPage />} />
            <Route path="transition" element={<ProjectTransitionPage />} />
          </Route>
        </Route>

        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
