import { motion, type Variants } from 'framer-motion'
import {
  LuTarget,
  LuSlidersHorizontal,
  LuShield,
  LuGitBranch,
  LuKanban,
  LuGauge,
} from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Section } from '@/components/layout/section'
import { ValueCard } from '@/components/cards/value-card'
import { MagicBentoGroup } from '@/components/effects/magic-bento'

const cardKeys = ['decisions', 'process', 'ownership', 'longevity', 'execution', 'simplicity'] as const

const cardIcons = {
  decisions: LuTarget,
  process: LuSlidersHorizontal,
  ownership: LuShield,
  longevity: LuGitBranch,
  execution: LuKanban,
  simplicity: LuGauge,
} as const

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

interface WhyWorkWithMeProps {
  className?: string
}

function WhyWorkWithMe({ className }: WhyWorkWithMeProps) {
  const { t } = useLanguage()

  return (
    <Section
      id="why-me"
      eyebrow={t('whyMe.eyebrow')}
      title={t('whyMe.title')}
      subtitle={t('whyMe.subtitle')}
      className={className}
    >
      <MagicBentoGroup spotlightRadius={550}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {cardKeys.map((key) => {
            const Icon = cardIcons[key]
            return (
              <motion.div key={key} variants={cardVariants}>
                <ValueCard
                  icon={<Icon size={24} />}
                  title={t(`whyMe.cards.${key}.title`)}
                  description={t(`whyMe.cards.${key}.desc`)}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </MagicBentoGroup>
    </Section>
  )
}

export { WhyWorkWithMe, type WhyWorkWithMeProps }
