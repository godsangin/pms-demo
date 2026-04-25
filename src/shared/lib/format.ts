import { AS_OF_DATE } from '@/mocks/db'

function parseIsoDateLocal(iso: string | undefined | null) {
  if (!iso) return null
  const [y, m, d] = iso.slice(0, 10).split('-').map((v) => Number(v))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function formatIsoDate(iso: string | undefined | null) {
  if (!iso) return '-'
  return iso.slice(0, 10)
}

export function formatPercent(value: number | undefined | null, digits = 0) {
  if (value === undefined || value === null) return '0%'
  return `${value.toFixed(digits)}%`
}

export function formatSignedPercent(value: number | undefined | null, digits = 0) {
  if (value === undefined || value === null) return '0%'
  const sign = value > 0 ? '+' : value < 0 ? '' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatDday(targetIso: string | undefined | null, asOfIso = AS_OF_DATE) {
  const asOf = parseIsoDateLocal(asOfIso)
  const target = parseIsoDateLocal(targetIso)
  if (!asOf || !target) return '-'

  const ms = target.getTime() - asOf.getTime()
  const days = Math.round(ms / (24 * 60 * 60 * 1000))
  if (days === 0) return 'D-day'
  if (days > 0) return `D-${days}`
  return `D+${Math.abs(days)}`
}
