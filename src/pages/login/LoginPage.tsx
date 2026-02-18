import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getActiveRole, setActiveRole } from '@/shared/lib/role'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Button } from '@/shared/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const { t } = useI18n()

  useEffect(() => {
    if (getActiveRole() === 'EXEC') navigate('/exec', { replace: true })
  }, [navigate])

  const destination = location.state?.from ?? '/exec'

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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                variant="primary"
                onClick={() => {
                  setActiveRole('EXEC')
                  navigate(destination, { replace: true })
                }}
              >
                {t('login.role.exec')}
              </Button>
              <Button variant="secondary" disabled title="MVP: disabled">
                {t('login.role.pmDisabled')}
              </Button>
              <Button variant="secondary" disabled title="MVP: disabled">
                {t('login.role.memberDisabled')}
              </Button>
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
