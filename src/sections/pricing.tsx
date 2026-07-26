import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { Section } from '@/components/layout/section'
import { PricingCard } from '@/components/cards/pricing-card'
import { scrollToSection } from '@/lib/scroll'
import { MagicBentoGroup } from '@/components/effects/magic-bento'

const cardKeys = ['presence', 'commerce', 'systems', 'transformation'] as const

function scrollToContact() {
  scrollToSection('contact')
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }),
}

interface PricingProps {
  className?: string
}

function Pricing({ className }: PricingProps) {
  const { t, tArr } = useLanguage()

  return (
    <Section
      id="pricing"
      eyebrow={t('pricing.eyebrow')}
      title={t('pricing.title')}
      subtitle={t('pricing.subtitle')}
      className={className}
    >
      <MagicBentoGroup spotlightRadius={550}>
        <motion.div
          
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {cardKeys.map((key, index) => (
            <motion.div key={key} variants={cardVariants}
            custom={typeof index !== "undefined" ? index : 0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }} className="flex">
              <PricingCard
                title={t(`pricing.cards.${key}.title`)}
                subtitle={t(`pricing.cards.${key}.subtitle`)}
                features={tArr(`pricing.cards.${key}.features`)}
                cta={t(`pricing.cards.${key}.cta`)}
                onCtaClick={scrollToContact}
              />
            </motion.div>
          ))}
        </motion.div>
      </MagicBentoGroup>

      <p className="mt-8 text-body-sm text-ink-tertiary text-center max-w-2xl mx-auto px-4">
        {t('pricing.trust')}
      </p>
    </Section>
  )
}

export { Pricing, type PricingProps }

