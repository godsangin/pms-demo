import type { Lang } from '@/shared/i18n/dict'

const LANG_KEY = 'pms-demo-lang'

export function getActiveLang(): Lang {
  const raw = window.localStorage.getItem(LANG_KEY)
  return raw === 'en' || raw === 'ko' ? raw : 'ko'
}

export function setActiveLang(lang: Lang) {
  window.localStorage.setItem(LANG_KEY, lang)
}
