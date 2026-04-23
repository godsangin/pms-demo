import { Button } from '@/shared/ui/Button'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { getCurrentUser } from '@/shared/lib/role'

export function TopBar({
  title,
  subtitle,
  onLogout,
}: {
  title: string
  subtitle?: string
  onLogout: () => void
}) {
  const { lang, setLang, t } = useI18n()
  const user = getCurrentUser()

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tracking-tight text-zinc-900">{title}</div>
        {subtitle ? <div className="truncate text-xs text-zinc-600">{subtitle}</div> : null}
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <div className="mr-2 text-xs font-medium text-zinc-700">
            <span className="text-zinc-400 mr-1">{user.role === 'ADMIN' ? '관리자' : '담당자'}:</span>
            {user.fullName}
          </div>
        )}
        <div className="hidden items-center rounded-xl border border-zinc-200 bg-white p-1 sm:flex">
          <button
            type="button"
            onClick={() => setLang('ko')}
            className={
              lang === 'ko'
                ? 'rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white'
                : 'rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100'
            }
            aria-pressed={lang === 'ko'}
          >
            KO
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={
              lang === 'en'
                ? 'rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white'
                : 'rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100'
            }
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          {t('app.logoutDemo')}
        </Button>
      </div>
    </div>
  )
}
