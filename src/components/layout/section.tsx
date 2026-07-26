import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  eyebrow?: string
  title?: string
  subtitle?: string
  className?: string
  id?: string
}

function Section({ children, eyebrow, title, subtitle, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-section', className)}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className="mb-12 lg:mb-16 max-w-2xl">
            {eyebrow && (
              <p className="text-eyebrow uppercase tracking-widest text-accent mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-headline font-display text-ink">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-body-lg text-ink-muted">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export { Section, type SectionProps }
