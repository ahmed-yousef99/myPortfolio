import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { ProjectCard } from '@/components/cards/project-card'
import { Modal } from '@/components/ui/modal'
import { ProjectModalContent } from '@/components/projects/project-modal-content'
import { projects } from '@/data/projects'
import { cn } from '@/lib/utils'
import { MagicBentoGroup } from '@/components/effects/magic-bento'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }),
}

interface FeaturedProjectsProps {
  className?: string
}

const featuredProjects = projects.filter((p) => p.featured)

function FeaturedProjects({ className }: FeaturedProjectsProps) {
  const { t } = useLanguage()
  const [activeProject, setActiveProject] = useState<string | null>(null)

  const active = activeProject ? projects.find((p) => p.id === activeProject) : null

  return (
    <>
      <section id="projects" className={cn('py-section', className)}>
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          {/* Featured Projects */}
          <div className="mb-12 lg:mb-16 max-w-2xl">
            <p className="text-eyebrow uppercase tracking-widest text-accent mb-3">
              {t('projects.eyebrow')}
            </p>
            <h2 className="text-headline font-display text-ink">
              {t('projects.featuredTitle')}
            </h2>
            <p className="mt-3 text-body-lg text-ink-muted">
              {t('projects.subtitle')}
            </p>
          </div>

          <MagicBentoGroup spotlightRadius={550}>
            <motion.div
              
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
            >
              {featuredProjects.map((project, index) => (
                <motion.div key={project.id} variants={cardVariants}
            custom={typeof index !== "undefined" ? index : 0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}>
                  <ProjectCard
                    project={project}
                    viewProjectLabel={t('projects.viewProject')}
                    openLiveLabel={t('projects.openLive')}
                    statusLiveLabel={t('projects.statusLive')}
                    viewSourceLabel={t('projects.viewSource')}
                    onViewDetails={() => setActiveProject(project.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </MagicBentoGroup>
        </div>
      </section>

      <Modal
        open={activeProject !== null}
        onClose={() => setActiveProject(null)}
        className="max-w-2xl"
      >
        {active && (
          <ProjectModalContent
            project={active}
            openLiveLabel={t('projects.openLive')}
            viewGitHubLabel={t('projects.viewGitHub')}
            statusLiveLabel={t('projects.statusLive')}
            galleryLabel={t('projects.gallery')}
          />
        )}
      </Modal>
    </>
  )
}

export { FeaturedProjects, type FeaturedProjectsProps }

