import { motion } from 'framer-motion'
import {
  LuBuilding2,
  LuShoppingCart,
  LuLayoutDashboard,
  LuLayers3,
  LuWorkflow,
  LuFileCode,
} from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Section } from '@/components/layout/section'
import { ServiceCard } from '@/components/cards/service-card'
import { MagicBentoGroup } from '@/components/effects/magic-bento'

const serviceKeys = [
  'presence',
  'commerce',
  'operations',
  'platforms',
  'automation',
  'custom',
] as const

const serviceIcons = {
  presence: LuBuilding2,
  commerce: LuShoppingCart,
  operations: LuLayoutDashboard,
  platforms: LuLayers3,
  automation: LuWorkflow,
  custom: LuFileCode,
} as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

interface ServicesProps {
  className?: string
}

function Services({ className }: ServicesProps) {
  const { t } = useLanguage()

  return (
    <Section
      id="services"
      eyebrow={t('services.eyebrow')}
      title={t('services.title')}
      subtitle={t('services.subtitle')}
      className={className}
    >
      <MagicBentoGroup spotlightRadius={550}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
        >
          {serviceKeys.map((key) => (
            <motion.div key={key} variants={cardVariants} className="flex">
              <ServiceCard
                icon={serviceIcons[key]}
                title={t(`services.cards.${key}.title`)}
                description={t(`services.cards.${key}.desc`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </MagicBentoGroup>
    </Section>
  )
}

export { Services, type ServicesProps }
