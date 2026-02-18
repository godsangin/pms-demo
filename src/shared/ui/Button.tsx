import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900 disabled:bg-zinc-300 disabled:border-zinc-300',
  secondary:
    'bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-300 disabled:text-zinc-400',
  ghost:
    'bg-transparent text-zinc-700 hover:bg-zinc-100 border-transparent disabled:text-zinc-400',
}

export function Button({
  className,
  variant = 'secondary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold tracking-tight shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  )
}
