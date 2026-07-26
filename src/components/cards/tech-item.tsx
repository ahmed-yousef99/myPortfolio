import { cn } from '@/lib/utils'

interface TechItemProps {
  icon?: React.ReactNode
  label: string
  className?: string
}

function TechItem({ icon, label, className }: TechItemProps) {
  return (
    <span
      className={cn(
        'group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
        'border border-hairline bg-surface-1',
        'hover:-translate-y-0.5 hover:bg-surface-2 hover:border-accent/20 hover:shadow-md',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50',
        className,
      )}
    >
      {icon && (
        <span className="text-ink-muted group-hover:text-accent transition-colors duration-200 shrink-0">
          {icon}
        </span>
      )}
      <span className="text-caption font-medium text-ink-muted group-hover:text-ink transition-colors duration-200">
        {label}
      </span>
    </span>
  )
}

export { TechItem, type TechItemProps }
