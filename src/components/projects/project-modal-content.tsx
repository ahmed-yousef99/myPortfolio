import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { LuExternalLink, LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Project } from '@/data/projects'

interface ProjectModalContentProps {
  project: Project
  openLiveLabel: string
  viewGitHubLabel: string
  statusLiveLabel: string
  galleryLabel: string
  className?: string
}

function ProjectModalContent({
  project,
  openLiveLabel,
  viewGitHubLabel,
  statusLiveLabel,
  galleryLabel,
  className,
}: ProjectModalContentProps) {
  const { lang, t } = useLanguage()
  const [galleryIndex, setGalleryIndex] = useState(0)

  const title = project.title[lang]
  const description = project.description[lang]

  const isRtl = lang === 'ar'

  const prevGallery = () => {
    setGalleryIndex((i) => (i - 1 + project.gallery.length) % project.gallery.length)
  }

  const nextGallery = () => {
    setGalleryIndex((i) => (i + 1) % project.gallery.length)
  }

  const PrevIcon = isRtl ? LuChevronRight : LuChevronLeft
  const NextIcon = isRtl ? LuChevronLeft : LuChevronRight

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Main image */}
      <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden bg-surface-2">
        <img
          src={project.gallery[galleryIndex]}
          alt={`${title} — ${galleryLabel}`}
          className="w-full h-full object-cover"
        />

        {project.gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevGallery}
              aria-label={t('projects.previousImage')}
              className="absolute start-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-colors"
            >
              <PrevIcon size={18} />
            </button>
            <button
              type="button"
              onClick={nextGallery}
              aria-label={t('projects.nextImage')}
              className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-colors"
            >
              <NextIcon size={18} />
            </button>
          </>
        )}
      </div>

      {/* Gallery thumbnails */}
      {project.gallery.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {project.gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setGalleryIndex(i)}
              className={cn(
                'w-16 h-10 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors',
                i === galleryIndex ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-headline-sm font-display text-ink">{title}</h3>
          <Badge variant="success">{statusLiveLabel}</Badge>
        </div>

        <p className="text-caption text-accent font-medium uppercase tracking-wider">
          {project.category}
        </p>

        <p className="text-body-sm text-ink-muted leading-relaxed">
          {description}
        </p>
      </div>

      {/* Tech stack */}
      <div className="flex flex-col gap-2">
        <h4 className="text-card-title font-display text-ink">{t('projects.techStack')}</h4>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-pill bg-accent/10 px-2.5 py-1 text-caption font-medium text-accent"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="md">
            <LuExternalLink size={14} />
            {openLiveLabel}
          </Button>
        </a>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="md">
              <FaGithub size={14} />
              {viewGitHubLabel}
            </Button>
          </a>
        )}
      </motion.div>
    </div>
  )
}

export { ProjectModalContent, type ProjectModalContentProps }
