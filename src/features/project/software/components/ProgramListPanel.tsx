import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { ProgramItem, ProgramStatus } from '@/shared/types/pms'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { formatIsoDate } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'
import { useRegisterProgramsBulkMutation, useUpdateProgramMutation } from '../hooks'

function parseIsoDateLocal(iso: string | undefined | null) {
  if (!iso) return null
  const [y, m, d] = iso.slice(0, 10).split('-').map((v) => Number(v))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function delayDays(baselineEnd: string | undefined | null, actualEnd: string | undefined | null) {
  const b = parseIsoDateLocal(baselineEnd)
  const a = parseIsoDateLocal(actualEnd)
  if (!b || !a) return 0
  return Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000))
}

function statusTone(status: ProgramStatus) {
  if (status === 'DONE') return 'green'
  if (status === 'BLOCKED') return 'red'
  if (status === 'IN_PROGRESS') return 'yellow'
  return 'zinc'
}

export function ProgramListPanel({ programs }: { programs: ProgramItem[] }) {
  const { t } = useI18n()
  const params = useParams()
  const projectId = params.projectId ?? ''
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<ProgramItem | undefined>()
  
  const bulkRegister = useRegisterProgramsBulkMutation()
  const updateProgram = useUpdateProgramMutation()

  const handleBatchRegister = () => {
    if (window.confirm('기존 프로그램 목록의 모든 항목을 일괄 등록하시겠습니까?')) {
      bulkRegister.mutate({ projectId, programs: [] }, {
        onSuccess: (_res) => alert(`성공적으로 \${_res.registeredCount}개의 프로그램이 등록되었습니다.`)
      })
    }
  }

  const openRegister = () => {
    setEditingProgram(undefined)
    setIsDrawerOpen(true)
  }

  const openEdit = (p: ProgramItem) => {
    setEditingProgram(p)
    setIsDrawerOpen(true)
  }

  const columns: Column<ProgramItem>[] = [
    {
      header: t('software.programs.col.program'),
      className: 'w-[300px]',
      cell: (p) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{p.code} | {p.name}</div>
          <div className="mt-0.5 text-xs text-zinc-600">{t('software.programs.col.owner')}: {p.owner}</div>
        </div>
      ),
    },
    {
      header: t('software.programs.col.status'),
      className: 'w-[110px] text-center',
      cell: (p) => (
        <div className="flex justify-center">
          <Badge tone={statusTone(p.status)}>{p.status}</Badge>
        </div>
      ),
    },
    {
      header: t('software.programs.col.progress'),
      className: 'w-[100px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900">{p.progressPct}%</div>,
    },
    {
      header: t('software.programs.col.baselineEnd'),
      className: 'w-[110px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900 text-xs">{formatIsoDate(p.baselineEnd)}</div>,
    },
    {
      header: t('software.programs.col.actualEnd'),
      className: 'w-[110px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900 text-xs">{formatIsoDate(p.actualEnd)}</div>,
    },
    {
      header: t('software.programs.col.delay'),
      className: 'w-[80px] text-right',
      cell: (p) => {
        const d = delayDays(p.baselineEnd, p.actualEnd)
        return (
          <div className={d > 0 ? 'tabular-nums font-semibold text-red-800' : 'tabular-nums text-zinc-900'}>
            {d > 0 ? `+${d}d` : d === 0 ? '0d' : `\${d}d`}
          </div>
        )
      },
    },
    {
      header: '',
      className: 'w-[80px] text-right',
      cell: (p) => (
        <Button size="xs" variant="outline" onClick={() => openEdit(p)}>수정</Button>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{t('software.programs.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-600">{programs.length}</div>
            <Button size="sm" variant="outline" onClick={handleBatchRegister} disabled={bulkRegister.isPending}>
              일괄 등록
            </Button>
            <Button size="sm" onClick={openRegister}>+ 프로그램 등록</Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {programs.length > 0 ? (
            <Table columns={columns} rows={programs} rowKey={(p) => p.id} />
          ) : (
            <div className="p-5 text-sm text-zinc-600">{t('software.programs.none')}</div>
          )}
        </CardBody>
      </Card>

      <Drawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={editingProgram ? "프로그램 수정" : "신규 프로그램 등록"}
      >
        <form className="p-6 space-y-5" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const updates = Object.fromEntries(formData.entries());
          
          if (editingProgram) {
            updateProgram.mutate({ 
              projectId, 
              programId: editingProgram.id, 
              updates: {
                ...updates,
                progressPct: Number(updates.progressPct)
              } as any 
            }, {
              onSuccess: () => {
                alert('수정되었습니다');
                setIsDrawerOpen(false);
              }
            });
          } else {
            alert('등록되었습니다');
            setIsDrawerOpen(false);
          }
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">프로그램 코드</label>
              <input name="code" defaultValue={editingProgram?.code} required className="w-full p-2 border rounded-xl text-sm" placeholder="API-001" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">담당자</label>
              <input name="owner" defaultValue={editingProgram?.owner} required className="w-full p-2 border rounded-xl text-sm" placeholder="홍길동" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">프로그램 명</label>
            <input name="name" defaultValue={editingProgram?.name} required className="w-full p-2 border rounded-xl text-sm" placeholder="사용자 인증 로직" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">상태</label>
              <select name="status" defaultValue={editingProgram?.status ?? 'NOT_STARTED'} className="w-full p-2 border rounded-xl text-sm bg-white">
                <option value="NOT_STARTED">NOT_STARTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">진척률 (%)</label>
              <input name="progressPct" type="number" min="0" max="100" defaultValue={editingProgram?.progressPct ?? 0} className="w-full p-2 border rounded-xl text-sm" />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <h5 className="text-xs font-bold text-zinc-400">일정 계획 및 실적</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">계획 시작일</label>
                <input name="baselineStart" type="date" defaultValue={editingProgram?.baselineStart} required className="w-full p-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">계획 종료일</label>
                <input name="baselineEnd" type="date" defaultValue={editingProgram?.baselineEnd} required className="w-full p-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">실제 시작일</label>
                <input name="actualStart" type="date" defaultValue={editingProgram?.actualStart} className="w-full p-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">실제 종료일</label>
                <input name="actualEnd" type="date" defaultValue={editingProgram?.actualEnd} className="w-full p-2 border rounded-xl text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>취소</Button>
            <Button type="submit" disabled={updateProgram.isPending}>
              {updateProgram.isPending ? '처리 중...' : editingProgram ? '수정 완료' : '등록하기'}
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
