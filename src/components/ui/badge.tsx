import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variants = ['default', 'success', 'muted', 'outline'] as const

type BadgeVariant = (typeof variants)[number]

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 text-ink-muted',
  success: 'bg-semantic-success/15 text-semantic-success',
  muted: 'bg-surface-2 text-ink-tertiary',
  outline: 'bg-transparent text-ink-muted border border-hairline',
}

function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2 py-0.5 text-caption font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
