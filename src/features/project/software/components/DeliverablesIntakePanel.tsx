import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { DeliverableItem, DeliveryStage, DeliverableStatus } from '@/shared/types/pms'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { I18nKey } from '@/shared/i18n/dict'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'
import { DeliverableUpload } from '../../components/DeliverableUpload'
import { useCreateDeliverableMutation } from '../hooks'
import { getActiveRole } from '@/shared/lib/role'
import { getStoredToken } from '@/shared/lib/storage'

function orderedStages(): DeliveryStage[] {
  return ['ANALYSIS_DESIGN', 'DEVELOPMENT', 'TEST', 'DEPLOYMENT']
}

function stageLabelKey(stage: DeliveryStage): I18nKey {
  if (stage === 'ANALYSIS_DESIGN') return 'software.stage.analysisDesign'
  if (stage === 'DEVELOPMENT') return 'software.stage.development'
  if (stage === 'TEST') return 'software.stage.test'
  return 'software.stage.deployment'
}

function statusTone(status: DeliverableStatus) {
  if (status === 'ACCEPTED') return 'green'
  if (status === 'REJECTED') return 'red'
  if (status === 'SUBMITTED') return 'yellow'
  return 'zinc'
}

export function DeliverablesIntakePanel({ items }: { items: DeliverableItem[] }) {
  const { t } = useI18n()
  const params = useParams()
  const projectId = params.projectId ?? ''
  
  const role = getActiveRole()
  const isAdmin = role === 'ADMIN'

  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [isDefineOpen, setIsDefineOpen] = useState(false)
  
  const createDeliverable = useCreateDeliverableMutation()
  
  const stageItems = items.filter((d) => Boolean(d.stage))
  const selectedItem = items.find(d => d.id === selectedId)

  const summary = orderedStages().map((stage) => {
    const list = stageItems.filter((d) => d.stage === stage)
    const total = list.length
    const received = list.filter((d) => d.status !== 'PLANNED').length
    const accepted = list.filter((d) => d.status === 'ACCEPTED').length
    const rejected = list.filter((d) => d.status === 'REJECTED').length
    const submitted = list.filter((d) => d.status === 'SUBMITTED').length
    return { stage, total, received, accepted, rejected, submitted }
  })

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

  const columns: Column<DeliverableItem>[] = [
    {
      header: t('deliverables.col.deliverable'),
      className: 'w-[300px]',
      cell: (d) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{d.title}</div>
        </div>
      ),
    },
    {
      header: t('software.deliverables.col.stage'),
      className: 'w-[140px]',
      cell: (d) => <div className="text-zinc-900">{d.stage ? t(stageLabelKey(d.stage)) : '-'}</div>,
    },
    {
      header: t('deliverables.col.status'),
      className: 'w-[120px] text-center',
      cell: (d) => (
        <div className="flex justify-center">
          <Badge tone={statusTone(d.status)}>{d.status}</Badge>
        </div>
      ),
    },
    {
      header: '테일러링',
      className: 'w-[100px] text-center',
      cell: (d) => (
        <div className="flex justify-center">
          {d.tailoringHistory && d.tailoringHistory.length > 0 ? (
            <Badge tone="blue">Y ({d.tailoringHistory.length})</Badge>
          ) : (
            <span className="text-zinc-400">-</span>
          )}
        </div>
      )
    },
    {
      header: '첨부파일',
      className: 'w-[150px]',
      cell: (d) => (
        <div className="text-xs">
          {d.filePath ? (
            <button 
              onClick={() => handleDownload(d.id, d.title)}
              className="text-blue-600 hover:underline truncate block max-w-[140px]" 
              title={d.title}
            >
              📎 첨부파일 다운로드
            </button>
          ) : (
            <span className="text-zinc-400">없음</span>
          )}
        </div>
      )
    },
    {
      header: '',
      className: 'w-[100px] text-right',
      cell: (d) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedId(d.id)}>
          관리
        </Button>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{t('software.deliverables.title')}</CardTitle>
          {isAdmin && (
            <Button size="sm" onClick={() => setIsDefineOpen(true)}>+ 신규 산출물 정의</Button>
          )}
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summary.map((s) => (
              <div key={s.stage} className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="text-xs font-semibold text-zinc-900">{t(stageLabelKey(s.stage))}</div>
                <div className="mt-1 text-xs text-zinc-600 tabular-nums">
                  {t('software.deliverables.received')}: <span className="font-semibold text-zinc-900">{s.received}</span>/{s.total}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge tone="green">ACCEPTED {s.accepted}</Badge>
                  <Badge tone="yellow">SUBMITTED {s.submitted}</Badge>
                  <Badge tone="red">REJECTED {s.rejected}</Badge>
                </div>
              </div>
            ))}
          </div>

          {stageItems.length > 0 ? (
            <Table columns={columns} rows={stageItems} rowKey={(d) => d.id} />
          ) : (
            <div className="text-sm text-zinc-600">{t('deliverables.none')}</div>
          )}
        </CardBody>
      </Card>

      <Drawer 
        open={Boolean(selectedId)} 
        onClose={() => setSelectedId(undefined)}
        title="산출물 관리 (입고/테일러링)"
        subtitle={selectedItem?.title}
      >
        <div className="p-6 space-y-8">
          <section>
            <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              테일러링 이력 관리
            </h4>
            <div className="space-y-3">
              {selectedItem?.tailoringHistory && selectedItem.tailoringHistory.length > 0 ? (
                selectedItem.tailoringHistory.map(h => (
                  <div key={h.id} className="p-3 border border-zinc-200 rounded-xl bg-zinc-50 text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <Badge tone={h.type === 'ADD' ? 'green' : h.type === 'REMOVE' ? 'red' : 'yellow'}>
                        {h.type}
                      </Badge>
                      <span className="text-zinc-500">{h.date}</span>
                    </div>
                    <p className="font-medium text-zinc-800">{h.reason}</p>
                    <div className="mt-1 text-zinc-500 text-[10px]">작성자: {h.author}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 border border-dashed rounded-xl text-center text-xs text-zinc-500 bg-zinc-50">
                  등록된 테일러링 이력이 없습니다.
                </div>
              )}
              {isAdmin && (
                <Button size="sm" variant="outline" className="w-full mt-2">+ 이력 추가</Button>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-zinc-900 rounded-full"></span>
              산출물 파일 입고
            </h4>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 mb-4">
              <h5 className="text-xs font-semibold text-zinc-900 mb-2">업로드 안내</h5>
              <ul className="text-[11px] text-zinc-600 list-disc list-inside space-y-1">
                <li>테일러링된 표준 양식을 준수해 주세요.</li>
                <li>파일 용량은 최대 50MB까지 가능합니다.</li>
              </ul>
            </div>

            {selectedId && (
              <DeliverableUpload 
                projectId={projectId}
                deliverableId={selectedId} 
                onUploadSuccess={() => {
                  console.log('Upload success');
                }} 
              />
            )}

            {selectedItem?.filePath && (
              <div className="mt-4 p-3 border rounded-xl bg-blue-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-900 truncate max-w-[200px]">{selectedItem.title}</div>
                  <div className="text-[10px] text-blue-700">업로드 완료</div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="xs" 
                    variant="outline" 
                    onClick={() => handleDownload(selectedItem.id, selectedItem.title)}
                  >
                    다운로드
                  </Button>
                  {isAdmin && (
                    <Button size="xs" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">삭제</Button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </Drawer>

      <Drawer
        open={isDefineOpen}
        onClose={() => setIsDefineOpen(false)}
        title="신규 산출물 정의"
      >
        <form className="p-6 space-y-5" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          
          createDeliverable.mutate({
            projectId,
            deliverable: {
              title: data.title as string,
              stage: data.stage as DeliveryStage,
              dueDate: data.dueDate as string,
              status: 'PLANNED'
            }
          }, {
            onSuccess: () => {
              alert('산출물이 정의되었습니다.');
              setIsDefineOpen(false);
            }
          });
        }}>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">산출물 명</label>
            <input name="title" required className="w-full p-2 border rounded-xl text-sm" placeholder="e.g. 요구사항 추적표" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">관리 단계</label>
            <select name="stage" required className="w-full p-2 border rounded-xl text-sm bg-white">
              <option value="ANALYSIS_DESIGN">{t('software.stage.analysisDesign')}</option>
              <option value="DEVELOPMENT">{t('software.stage.development')}</option>
              <option value="TEST">{t('software.stage.test')}</option>
              <option value="DEPLOYMENT">{t('software.stage.deployment')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">제출 예정일</label>
            <input name="dueDate" type="date" required className="w-full p-2 border rounded-xl text-sm" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDefineOpen(false)}>취소</Button>
            <Button type="submit" disabled={createDeliverable.isPending}>
              {createDeliverable.isPending ? '저장 중...' : '정의 완료'}
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
