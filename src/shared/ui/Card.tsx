import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/shared/lib/cn'

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('rounded-2xl border border-zinc-200 bg-white shadow-soft', className)}>
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('border-b border-zinc-200 px-5 py-4', className)}>{children}</div>
  )
}

export function CardTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('text-sm font-semibold text-zinc-900', className)}>{children}</div>
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { className?: string }) {
  return (
    <div className={cn('px-5 py-4', className)} {...props}>
      {children}
    </div>
  )
}
