import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getActiveRole, setCurrentUser } from '@/shared/lib/role'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Button } from '@/shared/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { db } from '@/mocks/db'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const { t } = useI18n()

  useEffect(() => {
    if (getActiveRole()) navigate('/exec', { replace: true })
  }, [navigate])

  const destination = location.state?.from ?? '/exec'

  const handleLogin = (username: string) => {
    const user = db.users.find(u => u.username === username)
    if (user) {
      setCurrentUser(user)
      navigate(destination, { replace: true })
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-[560px]">
        <div className="mb-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600">PMS Demo</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{t('login.title')}</div>
          <div className="mt-1 text-sm text-zinc-600">{t('login.subtitle')}</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('login.selectRole')}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-2">
              <div className="mb-2 font-medium text-sm text-zinc-700">관리자 계정</div>
              <Button
                variant="primary"
                onClick={() => handleLogin('komsco')}
              >
                한국조폐공사 (komsco) - 모든 컨텐츠 열람
              </Button>
              
              <div className="mt-4 mb-2 font-medium text-sm text-zinc-700">담당자 계정 (본인 컨텐츠만 열람)</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => handleLogin('seeroo')}>
                  시루 (seeroo)
                </Button>
                <Button variant="secondary" onClick={() => handleLogin('dukn')}>
                  덕은 (dukn)
                </Button>
                <Button variant="secondary" onClick={() => handleLogin('pytha')}>
                  피타 (pytha)
                </Button>
                <Button variant="secondary" onClick={() => handleLogin('nice')}>
                  나이스 (nice)
                </Button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-700">
              {t('login.demoPath')}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
