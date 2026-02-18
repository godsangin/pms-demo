import { AS_OF_DATE } from '@/mocks/db'

function parseIsoDateLocal(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map((v) => Number(v))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function formatIsoDate(iso: string) {
  return iso.slice(0, 10)
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`
}

export function formatSignedPercent(value: number, digits = 0) {
  const sign = value > 0 ? '+' : value < 0 ? '' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatDday(targetIso: string, asOfIso = AS_OF_DATE) {
  const asOf = parseIsoDateLocal(asOfIso)
  const target = parseIsoDateLocal(targetIso)
  const ms = target.getTime() - asOf.getTime()
  const days = Math.round(ms / (24 * 60 * 60 * 1000))
  if (days === 0) return 'D-day'
  if (days > 0) return `D-${days}`
  return `D+${Math.abs(days)}`
}
