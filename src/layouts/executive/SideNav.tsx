import { NavLink } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'
import { useI18n } from '@/shared/i18n/I18nProvider'

export function SideNav() {
  const { t } = useI18n()

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{t('nav.product')}</div>
        <div className="mt-1 text-base font-semibold tracking-tight text-zinc-900">
          {t('nav.execDemo')}
        </div>
      </div>

      <div className="px-3 py-3">
        <div className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('nav.section.exec')}</div>
        <NavLink
          to="/exec"
          end
          className={({ isActive }) =>
            cn(
              'flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold tracking-tight',
              isActive ? 'bg-zinc-900 text-white' : 'text-zinc-800 hover:bg-zinc-100',
            )
          }
        >
          {t('nav.exec.portfolio')}
          <span className="text-xs font-semibold opacity-70">/exec</span>
        </NavLink>

        <NavLink
          to="/exec/risks"
          className={({ isActive }) =>
            cn(
              'mt-1 flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold tracking-tight',
              isActive ? 'bg-zinc-900 text-white' : 'text-zinc-800 hover:bg-zinc-100',
            )
          }
        >
          {t('nav.exec.risks')}
          <span className="text-xs font-semibold opacity-70">/exec/risks</span>
        </NavLink>
      </div>

      <div className="mt-auto border-t border-zinc-200 px-5 py-4 text-xs text-zinc-500">{t('nav.footer.mockOnly')}</div>
    </div>
  )
}
