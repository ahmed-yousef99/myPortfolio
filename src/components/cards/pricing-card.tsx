import { LuCheck } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BorderGlow } from '@/components/effects/border-glow'

interface PricingCardProps {
  title: string
  subtitle: string
  features: string[]
  cta: string
  onCtaClick?: () => void
  className?: string
}

function PricingCard({
  title,
  subtitle,
  features,
  cta,
  onCtaClick,
  className,
}: PricingCardProps) {
  return (
    <BorderGlow
      edgeSensitivity={25}
      glowColor="235 70 68"
      backgroundColor="#0f1011"
      borderRadius={20}
      glowRadius={34}
      glowIntensity={0.65}
      coneSpread={26}
      animated={false}
      colors={['#5e6ad2', '#8b5cf6', '#38bdf8']}
      fillOpacity={0.20}
      className={cn('h-full transition-transform duration-300 ease-out hover:-translate-y-1', className)}
    >
      <div
        className="p-6 flex flex-col gap-0"
        style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <h3 className="text-card-title font-display text-ink">{title}</h3>
        <p className="text-body-sm text-ink-muted mt-1">{subtitle}</p>

        <div className="w-full h-px bg-hairline my-4" aria-hidden="true" />

        <ul className="flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-body-sm text-ink-muted">
              <LuCheck size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex-1" />

        <Button
          variant="secondary"
          size="md"
          onClick={onCtaClick}
          className="w-full mt-3"
        >
          {cta}
        </Button>
      </div>
    </BorderGlow>
  )
}

export { PricingCard, type PricingCardProps }
