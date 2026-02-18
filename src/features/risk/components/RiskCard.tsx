import { formatDday, formatIsoDate, formatSignedPercent } from '@/shared/lib/format'
import type { RiskSeverity } from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { cn } from '@/shared/lib/cn'

import type { RiskBoardItem } from '@/features/risk/types'

function severityTone(sev: RiskSeverity) {
  return sev === 'CRITICAL' ? 'red' : 'yellow'
}

export function RiskCard({
  item,
  onClick,
  draggable,
  onDragStart,
}: {
  item: RiskBoardItem
  onClick: () => void
  draggable?: boolean
  onDragStart?: (riskId: string) => void
}) {
  const { risk, project } = item
  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable}
      onDragStart={(e) => {
        if (!draggable) return
        e.dataTransfer.setData('text/plain', risk.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(risk.id)
      }}
      className={cn(
        'w-full rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-soft',
        'hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-zinc-900">{project.name}</div>
          <div className="mt-0.5 truncate text-sm font-semibold tracking-tight text-zinc-900">{risk.title}</div>
        </div>
        <Badge tone={severityTone(risk.severity)}>{risk.severity}</Badge>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="text-zinc-600">
          SV: <span className="tabular-nums font-semibold text-zinc-900">{formatSignedPercent(project.svThisWeek, 1)}</span>
        </div>
        <div className="text-right text-zinc-600">
          Target: <span className="tabular-nums font-semibold text-zinc-900">{formatIsoDate(risk.targetDate)}</span>
        </div>
        <div className="col-span-2 text-zinc-600">{formatDday(risk.targetDate)}</div>
      </div>
    </button>
  )
}
