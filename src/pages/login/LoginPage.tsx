import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getActiveRole, setCurrentUser } from '@/shared/lib/role'
import { setStoredToken } from '@/shared/lib/storage'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Button } from '@/shared/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { loginApi } from '@/features/auth/api'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const { t } = useI18n()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (getActiveRole()) navigate('/exec', { replace: true })
  }, [navigate])

  const destination = location.state?.from ?? '/exec'

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await loginApi(username, password)
      setStoredToken(response.access_token)
      setCurrentUser(response.user)
      navigate(destination, { replace: true })
    } catch (err: any) {
      setError(err.response?.status === 401 ? '아이디 또는 비밀번호가 일치하지 않습니다.' : '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (uid: string) => {
    setUsername(uid)
    setPassword('pms1234') // Default password for demo
    // We'll call handleLogin manually after state updates, or just use the values directly
  }

  // Effect to trigger login when username/password are set by quick login
  useEffect(() => {
    if (username && password === 'pms1234' && !isLoading) {
      handleLogin()
    }
  }, [username, password])

  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-[480px]">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600">ONDA PMS</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{t('login.title')}</div>
          <div className="mt-1 text-sm text-zinc-600">{t('login.subtitle')}</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('login.selectRole')}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">아이디</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-500">Quick Login (Demo)</span></div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleQuickLogin('komsco')}
                  disabled={isLoading}
                >
                  한국조폐공사 (komsco)
                </Button>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="secondary" onClick={() => handleQuickLogin('seeroo')} disabled={isLoading}>
                    시루 (seeroo)
                  </Button>
                  <Button variant="secondary" onClick={() => handleQuickLogin('dukn')} disabled={isLoading}>
                    덕은 (dukn)
                  </Button>
                  <Button variant="secondary" onClick={() => handleQuickLogin('pytha')} disabled={isLoading}>
                    피타 (pytha)
                  </Button>
                  <Button variant="secondary" onClick={() => handleQuickLogin('nice')} disabled={isLoading}>
                    나이스 (nice)
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
