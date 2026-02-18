import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

import { dict, type I18nKey, type Lang } from '@/shared/i18n/dict'
import { getActiveLang, setActiveLang } from '@/shared/i18n/lang'

type Vars = Record<string, string | number>

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k]
    return v === undefined ? `{${k}}` : String(v)
  })
}

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: I18nKey, vars?: Vars) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: PropsWithChildren) {
  const [lang, setLangState] = useState<Lang>(() => getActiveLang())

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    setActiveLang(next)
    document.documentElement.lang = next === 'ko' ? 'ko' : 'en'
  }, [])

  const t = useCallback(
    (key: I18nKey, vars?: Vars) => {
      const template = dict[lang][key] ?? dict.en[key] ?? key
      return interpolate(template, vars)
    },
    [lang],
  )

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
