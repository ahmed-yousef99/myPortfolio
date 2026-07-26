import { cn } from '@/lib/utils'

interface ProcessStepProps {
  number: number
  title: string
  description: string
  isLast?: boolean
  className?: string
}

function ProcessStep({
  number,
  title,
  description,
  isLast,
  className,
}: ProcessStepProps) {
  return (
    <div className={cn('relative flex gap-5', className)}>
      {/* Number + connector */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent text-button font-semibold shrink-0 border border-accent/20">
          {String(number).padStart(2, '0')}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-hairline my-2" aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      <div className="pb-8">
        <h3 className="text-card-title font-display text-ink mb-1.5">
          {title}
        </h3>
        <p className="text-body-sm text-ink-muted leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
    </div>
  )
}

export { ProcessStep, type ProcessStepProps }
