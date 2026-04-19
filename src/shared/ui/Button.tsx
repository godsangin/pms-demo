import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900 disabled:bg-zinc-300 disabled:border-zinc-300',
  secondary:
    'bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-300 disabled:text-zinc-400',
  outline:
    'bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-300 disabled:text-zinc-400',
  ghost:
    'bg-transparent text-zinc-700 hover:bg-zinc-100 border-transparent disabled:text-zinc-400',
}

const sizeClass: Record<Size, string> = {
  xs: 'px-2 py-1 text-[10px] rounded-lg',
  sm: 'px-2.5 py-1.5 text-xs rounded-lg',
  md: 'px-3 py-2 text-sm rounded-xl',
  lg: 'px-4 py-2.5 text-base rounded-2xl',
}

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 border font-semibold tracking-tight shadow-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  )
}
