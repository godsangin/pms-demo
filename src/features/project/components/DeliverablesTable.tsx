import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { DeliverableItem, DeliverableStatus, DeliveryStage } from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'
import { DeliverableUpload } from './DeliverableUpload'
import { 
  useCreateDeliverableMutation, 
  useRegisterDeliverablesBulkMutation,
  useUpdateDeliverableMutation 
} from '@/features/project/software/hooks'
import { getActiveRole } from '@/shared/lib/role'
import { getStoredToken } from '@/shared/lib/storage'

function statusTone(status: DeliverableStatus, progress?: number) {
  if (status === 'ACCEPTED' || progress === 100) return 'green'
  if (status === 'REJECTED') return 'red'
  if (status === 'SUBMITTED' || (progress && progress > 0)) return 'yellow'
  return 'zinc'
}

export function DeliverablesTable({ items }: { items: DeliverableItem[] }) {
  const { projectId } = useParams()
  const { t } = useI18n()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const role = getActiveRole()
  const isAdmin = role === 'ADMIN'

  const createMutation = useCreateDeliverableMutation()
  const bulkRegister = useRegisterDeliverablesBulkMutation()
  const updateMutation = useUpdateDeliverableMutation()

  const handleUpload = (id: string) => {
    setSelectedId(id)
    setIsUploadOpen(true)
  }

  const handleProgressChange = (id: string, nextPct: number) => {
    updateMutation.mutate({
      projectId: projectId!,
      deliverableId: id,
      updates: { progressPct: nextPct }
    })
  }

  const handleDownload = async (deliverableId: string, fileName: string) => {
    const token = getStoredToken()
    const url = `http://localhost:3000/api/projects/${projectId}/deliverables/${deliverableId}/download`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', fileName || 'deliverable_file')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert('파일 다운로드 중 오류가 발생했습니다.')
    }
  }

  const handleDownloadTemplate = () => {
    const headers = ['title', 'stage', 'dueDate', 'status']
    const sampleData = [
      '시스템 아키텍처 설계서,ANALYSIS_DESIGN,2024-05-15,PLANNED',
      '단위테스트 결과보고서,TEST,2024-06-10,PLANNED'
    ]
    const csvContent = [headers.join(','), ...sampleData].join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'deliverable_template.csv')
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
          title: obj.title,
          stage: (obj.stage || 'DEVELOPMENT') as DeliveryStage,
          dueDate: obj.dueDate,
          status: (obj.status || 'PLANNED') as DeliverableStatus,
        }
      })

      if (window.confirm(`${data.length}개의 산출물을 등록하시겠습니까?`)) {
        bulkRegister.mutate({ projectId: projectId!, deliverables: data }, {
          onSuccess: () => {
            alert('성공적으로 산출물이 등록되었습니다.')
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

  const columns: Column<DeliverableItem>[] = [
    {
      header: t('deliverables.col.deliverable'),
      className: 'w-[300px]',
      cell: (d) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{d.title}</div>
          {d.filePath && (
            <button 
              onClick={() => handleDownload(d.id, d.title)}
              className="mt-1 text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              📎 첨부파일 다운로드
            </button>
          )}
        </div>
      ),
    },
    {
      header: '진척률',
      className: 'w-[140px] text-center',
      cell: (d) => (
        <div className="flex items-center gap-2 justify-center">
          <select 
            value={d.progressPct || 0}
            onChange={(e) => handleProgressChange(d.id, Number(e.target.value))}
            className="text-[13px] border border-zinc-200 rounded-lg p-1 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => (
              <option key={val} value={val}>{val}%</option>
            ))}
          </select>
        </div>
      )
    },
    {
      header: t('deliverables.col.status'),
      className: 'w-[130px] text-center',
      cell: (d) => (
        <div className="flex flex-col items-center gap-1">
          <Badge tone={statusTone(d.status, d.progressPct)}>{d.status}</Badge>
          {((d.status as string) === 'NOT_SUBMITTED' || (d.status as string) === 'PLANNED') ? (
            <Button size="xs" variant="outline" onClick={() => handleUpload(d.id)}>업로드</Button>
          ) : d.filePath ? (
            <Button size="xs" variant="ghost" onClick={() => handleUpload(d.id)}>재업로드</Button>
          ) : null}
        </div>
      ),
    },
    {
      header: t('deliverables.col.due'),
      className: 'w-[120px] text-right',
      cell: (d) => <div className="tabular-nums text-zinc-900">{formatIsoDate(d.dueDate)}</div>,
    },
    {
      header: t('deliverables.col.submitted'),
      className: 'w-[120px] text-right',
      cell: (d) => (
        <div className="tabular-nums text-zinc-900">{d.submittedDate ? formatIsoDate(d.submittedDate) : '-'}</div>
      ),
    },
    {
      header: t('deliverables.col.decided'),
      className: 'w-[120px] text-right',
      cell: (d) => (
        <div className="tabular-nums text-zinc-900">{d.decidedDate ? formatIsoDate(d.decidedDate) : '-'}</div>
      ),
    },
  ]

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{t('deliverables.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
              서식 다운로드
            </Button>
            {isAdmin && (
              <>
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
                <Button 
                  size="sm" 
                  onClick={() => setIsCreateOpen(true)}
                >
                  + 새 산출물 등록
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {items.length > 0 ? (
            <Table columns={columns} rows={items} rowKey={(d) => d.id} />
          ) : (
            <div className="p-5 text-sm text-zinc-600">{t('deliverables.none')}</div>
          )}
        </CardBody>
      </Card>

      <Drawer 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        title="신규 산출물 등록"
      >
        <form className="p-6 space-y-5" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          
          createMutation.mutate({
            projectId: projectId!,
            deliverable: data as any
          }, {
            onSuccess: () => {
              alert('산출물이 등록되었습니다');
              setIsCreateOpen(false);
            }
          });
        }}>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">산출물 명칭</label>
            <input name="title" required className="w-full p-2 border rounded-xl text-sm" placeholder="e.g. 시스템 아키텍처 설계서" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">제출 예정일</label>
            <input name="dueDate" type="date" required className="w-full p-2 border rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">단계(Stage)</label>
            <select name="stage" className="w-full p-2 border rounded-xl text-sm bg-white" defaultValue="DEVELOPMENT">
              <option value="ANALYSIS_DESIGN">분석/설계</option>
              <option value="DEVELOPMENT">개발</option>
              <option value="TEST">테스트</option>
              <option value="DEPLOYMENT">배포/운영</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">현재 진척률 (%)</label>
            <input name="progressPct" type="number" min="0" max="100" defaultValue="0" className="w-full p-2 border rounded-xl text-sm" />
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>취소</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </Drawer>

      <Drawer 
        open={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        title="산출물 파일 업로드"
      >
        <div className="p-4">
          <DeliverableUpload 
            projectId={projectId!}
            deliverableId={selectedId || ''} 
            onUploadSuccess={() => setIsUploadOpen(false)}
          />
        </div>
      </Drawer>
    </>
  )
}
