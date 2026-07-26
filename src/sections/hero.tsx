import { lazy, Suspense } from 'react'
import { LuArrowRight } from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { scrollToSection } from '@/lib/scroll'
import { trackCtaClick } from '@/lib/analytics'

// Lazy-load HeroScene so Three.js doesn't block the critical render path.
// The h1 (LCP element) renders immediately; the 3D cube loads asynchronously.
const HeroScene = lazy(() =>
  import('@/components/hero/hero-scene').then(m => ({ default: m.HeroScene }))
)

interface HeroProps {
  className?: string
}

function Hero({ className }: HeroProps) {
  const { t, lang } = useLanguage()

  return (
    <section id="home" className={cn('relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24', className)}>
      <div
        className="pointer-events-none absolute inset-0 -top-40 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(94,106,210,0.12), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Text content */}
          <div className="flex flex-col gap-6 w-full lg:w-3/5 max-w-xl">
            {/* Identity */}
            <div
              className="flex flex-col hero-lcp-fade"
              style={{ animationDelay: '0ms' }}
            >
              <p className="text-body-sm font-medium text-ink">{t('hero.identity.name')}</p>
              <p className="text-caption text-ink-muted">{t('hero.identity.title')}</p>
            </div>

            {/* h1 */}
            <h1
              className="text-display-lg font-display text-ink tracking-tight hero-lcp-fade"
              style={{ animationDelay: '50ms' }}
            >
              {t('hero.headline')}
            </h1>

            {/* Subhead (The new LCP element) */}
            <p
              className="text-body-lg text-ink-muted leading-relaxed hero-lcp-fade"
              style={{ animationDelay: '100ms' }}
            >
              {t('hero.subhead')}
            </p>

            {/* Differentiator */}
            <div
              className="px-5 py-3 rounded-xl bg-accent/[0.03] border border-accent/10 hero-lcp-fade"
              style={{ animationDelay: '150ms' }}
            >
              <p className="text-body-sm text-ink-muted leading-relaxed">
                {t('hero.differentiator')}
              </p>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 hero-lcp-fade"
              style={{ animationDelay: '200ms' }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => { scrollToSection('contact'); trackCtaClick('get_free_quote') }}
                className="w-full sm:w-auto"
              >
                {t('hero.ctaPrimary')}
                <LuArrowRight size={16} className={cn('shrink-0', lang === 'ar' && 'rotate-180')} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => { scrollToSection('projects'); trackCtaClick('see_my_work') }}
                className="w-full sm:w-auto"
              >
                {t('hero.ctaSecondary')}
              </Button>
            </div>
          </div>

          {/* 3D Rubik's Cube — lazy loaded so it never blocks h1 paint */}
          <div
            className="relative flex items-center justify-center w-full lg:w-2/5 h-[320px] sm:h-[400px] lg:h-[520px] min-w-[280px] sm:min-w-[320px] lg:min-w-[380px]"
            aria-hidden="true"
          >
            {/* Background glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(94,106,210,0.18), rgba(140,100,255,0.08) 60%, transparent)',
              }}
            />
            {/* Canvas — loads asynchronously, h1 is already visible before this */}
            <div className="relative z-10 w-full h-full">
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero, type HeroProps }

