import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/shared/i18n/I18nProvider'
import { formatIsoDate } from '@/shared/lib/format'
import { readJson, writeJson } from '@/shared/lib/storage'
import type {
  IntakeStatus,
  ProgramItem,
  TestResult,
  TestScenario,
  TestScenarioStatus,
  TestType,
} from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Drawer } from '@/shared/ui/Drawer'
import { Table, type Column } from '@/shared/ui/Table'

type ScenarioOverride = Partial<Pick<TestScenario, 'status' | 'result' | 'intakeStatus' | 'evidenceNote' | 'executedDate'>>

type Overrides = Record<string, ScenarioOverride>

function key(projectId: string) {
  return `pms-demo-test-scenario-override:${projectId}`
}

function resultTone(r: TestResult) {
  if (r === 'PASS') return 'green'
  if (r === 'FAIL') return 'red'
  if (r === 'BLOCKED') return 'yellow'
  return 'zinc'
}

function intakeTone(s: IntakeStatus) {
  return s === 'RECEIVED' ? 'green' : 'zinc'
}

export function TestManagementPanel({
  projectId,
  programs,
  scenarios,
}: {
  projectId: string
  programs: ProgramItem[]
  scenarios: TestScenario[]
}) {
  const { t } = useI18n()

  const [activeType, setActiveType] = useState<TestType>('UNIT')
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [overrides, setOverrides] = useState<Overrides>({})

  useEffect(() => {
    const initial = readJson<Overrides>(key(projectId))
    if (initial) setOverrides(initial)
  }, [projectId])

  useEffect(() => {
    writeJson(key(projectId), overrides)
  }, [overrides, projectId])

  const programById = useMemo(() => new Map(programs.map((p) => [p.id, p] as const)), [programs])

  const merged = useMemo(() => {
    return scenarios.map((s) => {
      const o = overrides[s.id]
      return o ? { ...s, ...o } : s
    })
  }, [overrides, scenarios])

  const list = useMemo(() => merged.filter((s) => s.type === activeType), [activeType, merged])

  const selected = useMemo(() => (selectedId ? merged.find((s) => s.id === selectedId) : undefined), [merged, selectedId])

  const updateSelected = (patch: ScenarioOverride) => {
    if (!selected) return
    setOverrides((prev) => ({
      ...prev,
      [selected.id]: { ...prev[selected.id], ...patch },
    }))
  }

  const columns: Column<TestScenario>[] = [
    {
      header: t('software.tests.col.program'),
      className: 'w-[260px]',
      cell: (s) => {
        const p = programById.get(s.programId)
        return (
          <div className="leading-tight">
            <div className="font-semibold text-zinc-900">{p ? `${p.code}` : s.programId}</div>
            <div className="mt-0.5 text-xs text-zinc-600">{p?.name ?? '-'}</div>
          </div>
        )
      },
    },
    {
      header: t('software.tests.col.scenario'),
      className: 'w-[420px]',
      cell: (s) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{s.title}</div>
          <div className="mt-0.5 text-xs text-zinc-600">{s.id}</div>
        </div>
      ),
    },
    {
      header: t('software.tests.col.status'),
      className: 'w-[120px] text-center',
      cell: (s) => (
        <div className="flex justify-center">
          <Badge tone="zinc">{s.status}</Badge>
        </div>
      ),
    },
    {
      header: t('software.tests.col.result'),
      className: 'w-[120px] text-center',
      cell: (s) => (
        <div className="flex justify-center">
          <Badge tone={resultTone(s.result)}>{s.result}</Badge>
        </div>
      ),
    },
    {
      header: t('software.tests.col.owner'),
      className: 'w-[120px]',
      cell: (s) => <div className="text-zinc-900">{s.owner}</div>,
    },
    {
      header: t('software.tests.col.intake'),
      className: 'w-[120px] text-center',
      cell: (s) => (
        <div className="flex justify-center">
          <Badge tone={intakeTone(s.intakeStatus)}>{s.intakeStatus}</Badge>
        </div>
      ),
    },
    {
      header: t('software.tests.col.executed'),
      className: 'w-[120px] text-right',
      cell: (s) => <div className="tabular-nums text-zinc-900">{s.executedDate ? formatIsoDate(s.executedDate) : '-'}</div>,
    },
  ]

  const Tab = ({ type }: { type: TestType }) => (
    <Button
      variant={activeType === type ? 'primary' : 'secondary'}
      className="h-9"
      onClick={() => setActiveType(type)}
    >
      {type === 'UNIT' ? t('software.tests.tab.unit') : t('software.tests.tab.integration')}
    </Button>
  )

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>{t('software.tests.title')}</CardTitle>
        <div className="flex items-center gap-2">
          <Tab type="UNIT" />
          <Tab type="INTEGRATION" />
          <div className="ml-1 text-xs text-zinc-600">{list.length}</div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {list.length > 0 ? (
          <Table
            columns={columns}
            rows={list}
            rowKey={(s) => s.id}
            className="border-0"
            onRowClick={(s) => setSelectedId(s.id)}
          />
        ) : (
          <div className="p-5 text-sm text-zinc-600">{t('software.tests.none')}</div>
        )}
      </CardBody>

      <Drawer
        open={Boolean(selected)}
        title={t('software.tests.drawer.title')}
        subtitle={selected ? `${selected.id} | ${selected.type}` : undefined}
        onClose={() => setSelectedId(undefined)}
      >
        {selected ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('software.tests.drawer.program')}</div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">
                {(programById.get(selected.programId)?.code ?? selected.programId) + ' | ' + (programById.get(selected.programId)?.name ?? '-')}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('software.tests.drawer.scenario')}</div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">{selected.title}</div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('software.tests.drawer.status')}</div>
                <select
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm"
                  value={selected.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const next = e.target.value as TestScenarioStatus
                    const executedDate = next === 'EXECUTED' && !selected.executedDate ? new Date().toISOString().slice(0, 10) : selected.executedDate
                    updateSelected({ status: next, executedDate })
                  }}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="READY">READY</option>
                  <option value="EXECUTED">EXECUTED</option>
                </select>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('software.tests.drawer.result')}</div>
                <select
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm"
                  value={selected.result}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const next = e.target.value as TestResult
                    updateSelected({ result: next })
                  }}
                >
                  <option value="NA">NA</option>
                  <option value="PASS">PASS</option>
                  <option value="FAIL">FAIL</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('software.tests.drawer.intake')}</div>
                <select
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm"
                  value={selected.intakeStatus}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const next = e.target.value as IntakeStatus
                    updateSelected({ intakeStatus: next })
                  }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="RECEIVED">RECEIVED</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('software.tests.drawer.evidence')}</div>
              <textarea
                className="mt-2 min-h-[96px] w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                value={selected.evidenceNote}
                onChange={(e) => updateSelected({ evidenceNote: e.target.value })}
              />
              <div className="mt-2 text-xs text-zinc-600">
                {t('software.tests.drawer.evidenceHint')}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </Card>
  )
}
