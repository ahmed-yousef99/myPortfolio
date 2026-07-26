import { LuMessageCircle, LuCheck } from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Button } from '@/components/ui/button'
import { BorderGlow } from '@/components/effects/border-glow'
import { cn } from '@/lib/utils'
import { scrollToSection } from '@/lib/scroll'

interface CtaBannerProps {
  className?: string
}

function CtaBanner({ className }: CtaBannerProps) {
  const { t, tArr } = useLanguage()

  const handleClick = () => {
    scrollToSection('contact')
  }

  return (
    <section className={cn('py-section', className)}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <BorderGlow
          edgeSensitivity={25}
          glowColor="235 70 68"
          backgroundColor="#0f1011"
          borderRadius={24}
          glowRadius={42}
          glowIntensity={0.75}
          coneSpread={28}
          animated={true}
          colors={['#5e6ad2', '#8b5cf6', '#38bdf8']}
          fillOpacity={0.28}
        >
          <div className="relative z-10 flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between lg:p-10">
            <div className="max-w-2xl text-center md:text-start">
              <span className="text-eyebrow font-text text-accent uppercase tracking-wider block">
                {t('ctaBanner.eyebrow')}
              </span>

              <h2 className="text-headline font-display text-ink mt-2 mx-auto md:mx-0 max-w-2xl leading-tight font-semibold">
                {t('ctaBanner.title')}
              </h2>

              <p className="text-body text-ink-muted mt-3 mx-auto md:mx-0 max-w-xl leading-relaxed">
                {t('ctaBanner.text')}
              </p>

              <ul className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-body-sm text-ink-muted font-text">
                {tArr('ctaBanner.checklist').map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <LuCheck size={16} className="text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto">
              <div className="flex flex-col items-center gap-2 text-center w-full">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleClick}
                  className="w-full md:w-auto shadow-md"
                >
                  <LuMessageCircle size={18} />
                  {t('ctaBanner.button')}
                </Button>
                <p className="text-caption text-ink-tertiary text-center">
                  {t('ctaBanner.microcopy')}
                </p>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>
    </section>
  )
}

export { CtaBanner, type CtaBannerProps }

