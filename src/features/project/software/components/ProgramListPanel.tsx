import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { ProgramItem, ProgramStatus } from '@/shared/types/pms'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { formatIsoDate } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'
import { useRegisterProgramsBulkMutation, useUpdateProgramMutation, useCreateTaskMutation } from '../hooks'
import { getActiveRole } from '@/shared/lib/role'

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
  if (status === 'DONE' || status === 'COMPLETED') return 'green'
  if (status === 'BLOCKED') return 'red'
  if (status === 'IN_PROGRESS') return 'yellow'
  return 'zinc'
}

function toDateInputStr(iso: string | undefined | null) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export function ProgramListPanel({ programs }: { programs: ProgramItem[] }) {
  const { t } = useI18n()
  const params = useParams()
  const projectId = params.projectId ?? ''
  
  const role = getActiveRole()
  const isAdmin = role === 'ADMIN'

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<ProgramItem | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const bulkRegister = useRegisterProgramsBulkMutation()
  const updateProgram = useUpdateProgramMutation()
  const createTask = useCreateTaskMutation()

  const handleDownloadTemplate = () => {
    const headers = ['code', 'name', 'owner', 'status', 'progressPct', 'baselineStart', 'baselineEnd', 'actualStart', 'actualEnd']
    const sampleData = [
      'API-001,사용자 로그인 API,홍길동,NOT_STARTED,0,2024-05-01,2024-05-10,,',
      'WEB-001,메인 대시보드 개발,이순신,IN_PROGRESS,30,2024-05-05,2024-05-20,2024-05-06,'
    ]
    const csvContent = [headers.join(','), ...sampleData].join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'program_template.csv')
    link.click()
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) {
        alert('CSV 파일에 데이터가 없습니다.')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => {
          obj[h] = values[i]
        })
        return {
          code: obj.code,
          name: obj.name,
          owner: obj.owner,
          status: (obj.status || 'NOT_STARTED') as ProgramStatus,
          progressPct: Number(obj.progressPct || 0),
          baselineStart: obj.baselineStart,
          baselineEnd: obj.baselineEnd,
          actualStart: obj.actualStart || undefined,
          actualEnd: obj.actualEnd || undefined,
        }
      })

      if (window.confirm(`${data.length}개의 프로그램을 등록하시겠습니까?`)) {
        bulkRegister.mutate({ projectId, programs: data }, {
          onSuccess: (res) => {
            alert(`성공적으로 ${res.registeredCount}개의 프로그램이 등록되었습니다.`)
            if (fileInputRef.current) fileInputRef.current.value = ''
          },
          onError: (err) => {
            alert(`등록 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`)
          }
        })
      }
    }
    reader.readAsText(file)
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
            {isAdmin && (
              <>
                <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
                  서식 다운로드
                </Button>
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={bulkRegister.isPending}>
                  CSV 일괄 등록
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleCsvUpload} 
                />
                <Button size="sm" onClick={openRegister}>+ 프로그램 등록</Button>
              </>
            )}
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
        <form 
          key={editingProgram?.id || 'new'}
          className="p-6 space-y-5" 
          onSubmit={(e) => {
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
              createTask.mutate({
                projectId,
                task: {
                  ...updates,
                  category: 'PROGRAM',
                  progressPct: Number(updates.progressPct)
                } as any
              }, {
                onSuccess: () => {
                  alert('등록되었습니다');
                  setIsDrawerOpen(false);
                }
              });
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">프로그램 코드</label>
              <input name="code" defaultValue={editingProgram?.code} required className="w-full p-2 border rounded-xl text-sm bg-white" placeholder="API-001" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">담당자</label>
              <input name="owner" defaultValue={editingProgram?.owner} required className="w-full p-2 border rounded-xl text-sm bg-white" placeholder="홍길동" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">프로그램 명</label>
            <input name="name" defaultValue={editingProgram?.name} required className="w-full p-2 border rounded-xl text-sm bg-white" placeholder="사용자 인증 로직" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">상태</label>
              <select name="status" defaultValue={editingProgram?.status ?? 'NOT_STARTED'} className="w-full p-2 border rounded-xl text-sm bg-white">
                <option value="NOT_STARTED">NOT_STARTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">진척률 (%)</label>
              <input name="progressPct" type="number" min="0" max="100" defaultValue={editingProgram?.progressPct ?? 0} className="w-full p-2 border rounded-xl text-sm bg-white" />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <h5 className="text-xs font-bold text-zinc-400">일정 계획 및 실적</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">계획 시작일</label>
                <input name="baselineStart" type="date" defaultValue={toDateInputStr(editingProgram?.baselineStart)} required className="w-full p-2 border rounded-xl text-sm bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">계획 종료일</label>
                <input name="baselineEnd" type="date" defaultValue={toDateInputStr(editingProgram?.baselineEnd)} required className="w-full p-2 border rounded-xl text-sm bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">실제 시작일</label>
                <input name="actualStart" type="date" defaultValue={toDateInputStr(editingProgram?.actualStart)} className="w-full p-2 border rounded-xl text-sm bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">실제 종료일</label>
                <input name="actualEnd" type="date" defaultValue={toDateInputStr(editingProgram?.actualEnd)} className="w-full p-2 border rounded-xl text-sm bg-white" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>취소</Button>
            <Button type="submit" disabled={updateProgram.isPending || createTask.isPending}>
              {updateProgram.isPending || createTask.isPending ? '처리 중...' : editingProgram ? '수정 완료' : '등록하기'}
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
