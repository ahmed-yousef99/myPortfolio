import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { LuPlus } from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Section } from '@/components/layout/section'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

interface FaqProps {
  className?: string
}

function Faq({ className }: FaqProps) {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqKeys = ['timeline', 'stack', 'revisions', 'maintenance', 'ownership', 'start'] as const

  return (
    <Section
      id="faq"
      eyebrow={t('faq.eyebrow')}
      title={t('faq.title')}
      subtitle={t('faq.subtitle')}
      className={className}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="flex flex-col gap-2"
      >
        {faqKeys.map((key, index) => (
          <motion.div key={key} variants={itemVariants}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 rounded-lg bg-surface-1 border border-hairline text-left transition-colors hover:border-hairline-strong"
              aria-expanded={openIndex === index}
            >
              <span className="text-ink font-medium">{t(`faq.items.${key}.q`)}</span>
              <LuPlus
                size={16}
                className={`text-ink-subtle shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-45' : ''}`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 py-4 text-ink-muted text-sm leading-relaxed border-x border-b border-hairline rounded-b-lg bg-surface-1">
                    {t(`faq.items.${key}.a`)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

export { Faq, type FaqProps }