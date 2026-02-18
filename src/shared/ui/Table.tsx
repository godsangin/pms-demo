import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

export type Column<T> = {
  header: string
  className?: string
  cell: (row: T) => ReactNode
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  className,
  onRowClick,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  className?: string
  onRowClick?: (row: T) => void
}) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-zinc-200', className)}>
      <table className="w-full border-collapse">
        <thead className="bg-zinc-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.header}
                className={cn(
                  'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-600',
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {rows.map((r, idx) => (
            <tr
              key={rowKey(r)}
              className={cn(
                'bg-white',
                idx % 2 === 1 && 'bg-zinc-50/30',
                onRowClick && 'cursor-pointer hover:bg-zinc-50',
              )}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
            >
              {columns.map((c) => (
                <td key={c.header} className={cn('px-3 py-2 align-top text-sm', c.className)}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
