import type { IconType } from 'react-icons'
import { cn } from '@/lib/utils'
import { MagicBento } from '@/components/effects/magic-bento'

interface ServiceCardProps {
  icon: IconType
  title: string
  description: string
  className?: string
}

function ServiceCard({ icon: Icon, title, description, className }: ServiceCardProps) {
  return (
    <MagicBento
      enableSpotlight
      enableBorderGlow
      className={cn(
        'h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out',
        className
      )}
      innerClassName="p-6 bg-surface-1 flex flex-col gap-5 hover:bg-surface-2 transition-colors duration-300"
    >
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
        aria-hidden="true"
      />
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/10 text-accent-muted group-hover:text-accent transition-all duration-200">
        <Icon size={24} className="group-hover:scale-105 transition-transform duration-200" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-display text-ink font-semibold">{title}</h3>
        <p className="text-body-sm text-ink-muted leading-relaxed">
          {description}
        </p>
      </div>
    </MagicBento>
  )
}

export { ServiceCard, type ServiceCardProps }
