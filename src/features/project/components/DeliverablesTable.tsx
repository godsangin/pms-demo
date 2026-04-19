import { useState } from 'react'
import { formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { DeliverableItem, DeliverableStatus } from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'
import { DeliverableUpload } from './DeliverableUpload'

function statusTone(status: DeliverableStatus) {
  if (status === 'ACCEPTED') return 'green'
  if (status === 'REJECTED') return 'red'
  if (status === 'SUBMITTED') return 'yellow'
  return 'zinc'
}

export function DeliverablesTable({ items }: { items: DeliverableItem[] }) {
  const { t } = useI18n()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleUpload = (id: string) => {
    setSelectedId(id)
    setIsUploadOpen(true)
  }

  const columns: Column<DeliverableItem>[] = [
    {
      header: t('deliverables.col.deliverable'),
      className: 'w-[360px]',
      cell: (d) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{d.title}</div>
          <div className="mt-0.5 text-xs text-zinc-600">{d.id}</div>
        </div>
      ),
    },
    {
      header: t('deliverables.col.status'),
      className: 'w-[130px] text-center',
      cell: (d) => (
        <div className="flex flex-col items-center gap-1">
          <Badge tone={statusTone(d.status)}>{d.status}</Badge>
          {(d.status as string) === 'NOT_SUBMITTED' && (
            <Button size="xs" variant="outline" onClick={() => handleUpload(d.id)}>업로드</Button>
          )}
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
          <Button size="sm">+ 새 산출물 등록</Button>
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
        open={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        title="산출물 파일 업로드"
      >
        <div className="p-4">
          <DeliverableUpload 
            deliverableId={selectedId || ''} 
            onUploadSuccess={() => setIsUploadOpen(false)}
          />
        </div>
      </Drawer>
    </>
  )
}
