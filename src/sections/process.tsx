import { motion, type Variants } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { Section } from '@/components/layout/section'
import { ProcessStep } from '@/components/cards/process-step'

const stepKeys = ['discovery', 'planning', 'development', 'review', 'launch'] as const



interface ProcessProps {
  className?: string
}

function Process({ className }: ProcessProps) {
  const { t, lang } = useLanguage()

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: lang === 'ar' ? 20 : -20 },
    visible: (i: number = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }),
  }

  return (
    <Section
      id="process"
      eyebrow={t('process.eyebrow')}
      title={t('process.title')}
      subtitle={t('process.subtitle')}
      className={className}
    >
      <div
        className="max-w-2xl"
      >
        {stepKeys.map((key, i) => (
          <motion.div key={key} variants={itemVariants}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}>
            <ProcessStep
              number={i + 1}
              title={t(`process.steps.${key}.title`)}
              description={t(`process.steps.${key}.desc`)}
              isLast={i === stepKeys.length - 1}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

export { Process, type ProcessProps }


