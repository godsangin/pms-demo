import type { DragEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { RiskCard } from '@/features/risk/components/RiskCard'
import { useRisksBoardQuery } from '@/features/risk/hooks'
import type { RiskStatusOverride } from '@/features/risk/types'
import { useExecutiveTopBar } from '@/layouts/executive/ExecutiveLayout'
import { formatDday, formatIsoDate } from '@/shared/lib/format'
import { readJson, writeJson } from '@/shared/lib/storage'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { I18nKey } from '@/shared/i18n/dict'
import type { RiskStatus } from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Drawer } from '@/shared/ui/Drawer'

const RISK_STATUS_KEY = 'pms-demo-risk-status-override'

function statusLabelKey(status: RiskStatus) {
  if (status === 'OPEN') return 'risksBoard.column.open'
  if (status === 'MITIGATING') return 'risksBoard.column.mitigating'
  return 'risksBoard.column.closed'
}

export function ExecRisksBoardPage() {
  const { t, lang } = useI18n()
  const { setTopBar } = useExecutiveTopBar()
  const { data, isLoading, isError, error } = useRisksBoardQuery(lang)

  const [selectedRiskId, setSelectedRiskId] = useState<string | undefined>(undefined)
  const [statusOverride, setStatusOverride] = useState<RiskStatusOverride>({})

  const [dropTarget, setDropTarget] = useState<RiskStatus | undefined>(undefined)

  useEffect(() => {
    const initial = readJson<RiskStatusOverride>(RISK_STATUS_KEY)
    if (initial) setStatusOverride(initial)
  }, [])

  useEffect(() => {
    writeJson(RISK_STATUS_KEY, statusOverride)
  }, [statusOverride])

  const setRiskStatus = useCallback((riskId: string, status: RiskStatus) => {
    setStatusOverride((prev) => ({ ...prev, [riskId]: status }))
  }, [])

  useEffect(() => {
    setTopBar({ title: t('risksBoard.topbar.title'), subtitle: t('risksBoard.topbar.subtitle') })
  }, [setTopBar, t])

  const items = useMemo(() => {
    if (!data) return []
    return data.items.map((it) => {
      const next = statusOverride[it.risk.id]
      return next ? { ...it, risk: { ...it.risk, status: next } } : it
    })
  }, [data, statusOverride])

  const columns = useMemo(() => {
    const col: Record<RiskStatus, typeof items> = { OPEN: [], MITIGATING: [], CLOSED: [] }
    for (const it of items) col[it.risk.status].push(it)

    const sevScore = (sev: string) => (sev === 'CRITICAL' ? 2 : 1)
    for (const key of Object.keys(col) as RiskStatus[]) {
      col[key] = [...col[key]].sort((a, b) => {
        const bySev = sevScore(b.risk.severity) - sevScore(a.risk.severity)
        if (bySev !== 0) return bySev
        return a.risk.targetDate.localeCompare(b.risk.targetDate)
      })
    }
    return col
  }, [items])

  const selected = useMemo(() => {
    if (!selectedRiskId) return undefined
    return items.find((x) => x.risk.id === selectedRiskId)
  }, [items, selectedRiskId])

  if (isError) {
    const message = error instanceof Error ? error.message : t('app.unknownError')
    return (
      <Card>
        <CardBody>
          <div className="text-sm font-semibold text-zinc-900">{t('risksBoard.error.title')}</div>
          <div className="mt-1 text-sm text-zinc-600">{message}</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {(['OPEN', 'MITIGATING', 'CLOSED'] as RiskStatus[]).map((status) => (
          <div key={status} className="xl:col-span-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{t(statusLabelKey(status) as I18nKey)}</CardTitle>
                <div className="text-xs text-zinc-600">{columns[status].length}</div>
              </CardHeader>
              <CardBody
                className={
                  dropTarget === status
                    ? 'space-y-2 rounded-b-2xl outline outline-2 outline-zinc-300 outline-offset-[-2px]'
                    : 'space-y-2'
                }
                onDragEnter={() => setDropTarget(status)}
                onDragOver={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault()
                  setDropTarget(status)
                }}
                onDragLeave={() => setDropTarget((prev) => (prev === status ? undefined : prev))}
                onDrop={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault()
                  const riskId = e.dataTransfer.getData('text/plain')
                  if (riskId) setRiskStatus(riskId, status)
                  setDropTarget(undefined)
                }}
              >
                {isLoading && !data ? <div className="text-sm text-zinc-600">{t('app.loading')}</div> : null}
                {columns[status].map((it) => (
                  <RiskCard
                    key={it.risk.id}
                    item={it}
                    draggable
                    onDragStart={() => setDropTarget(undefined)}
                    onClick={() => setSelectedRiskId(it.risk.id)}
                  />
                ))}
                {!isLoading && columns[status].length === 0 ? (
                  <div className="text-sm text-zinc-600">{t('risksBoard.empty')}</div>
                ) : null}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      <Drawer
        open={Boolean(selected)}
        title={t('risksBoard.drawer.title')}
        subtitle={selected ? selected.project.name : undefined}
        onClose={() => setSelectedRiskId(undefined)}
      >
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="mt-1 truncate text-lg font-semibold tracking-tight text-zinc-900">
                  {selected.risk.title}
                </div>
              </div>
              <Badge tone={selected.risk.severity === 'CRITICAL' ? 'red' : 'yellow'}>{selected.risk.severity}</Badge>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('risksBoard.drawer.status')}</div>
              <div className="mt-2">
                <select
                  value={selected.risk.status}
                  onChange={(e) => {
                    const next = e.target.value as RiskStatus
                    setRiskStatus(selected.risk.id, next)
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="MITIGATING">MITIGATING</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('risksBoard.drawer.owner')}</div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">{selected.risk.owner}</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('risksBoard.drawer.target')}</div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-zinc-900">{formatIsoDate(selected.risk.targetDate)}</div>
                <div className="text-xs font-semibold text-zinc-600">{formatDday(selected.risk.targetDate)}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('risksBoard.drawer.reason')}</div>
              <div className="mt-2 text-sm text-zinc-800">{selected.risk.cause}</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('risksBoard.drawer.action')}</div>
              <div className="mt-2 text-sm text-zinc-800">{selected.risk.action}</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('risksBoard.drawer.effect')}</div>
              <div className="mt-2 text-sm text-zinc-800">{selected.risk.expectedImpact}</div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
