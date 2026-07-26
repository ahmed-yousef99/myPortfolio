import { cn } from '@/lib/utils'

interface TechBadgeProps {
  label: string
  className?: string
}

function TechBadge({ label, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-lg text-caption font-medium',
        'bg-surface-1 text-ink-muted',
        'hover:bg-surface-2 hover:text-ink',
        'transition-colors duration-150',
        className,
      )}
    >
      {label}
    </span>
  )
}

export { TechBadge, type TechBadgeProps }
