import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { cn } from '@/shared/lib/cn'

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/20"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-soft',
          'border-l border-zinc-200',
        )}
      >
        <div className="border-b border-zinc-200 px-5 py-4">
          <div className="text-sm font-semibold tracking-tight text-zinc-900">{title}</div>
          {subtitle ? <div className="mt-0.5 text-xs text-zinc-600">{subtitle}</div> : null}
        </div>
        <div className="h-[calc(100%-57px)] overflow-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
