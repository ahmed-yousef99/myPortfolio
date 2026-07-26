import { FaGithub } from 'react-icons/fa'
import { LuExternalLink } from 'react-icons/lu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'
import type { Project } from '@/data/projects'
import { MagicBento } from '@/components/effects/magic-bento'

interface ProjectCardProps {
  project: Project
  viewProjectLabel: string
  openLiveLabel: string
  statusLiveLabel: string
  viewSourceLabel?: string
  onViewDetails: () => void
  className?: string
}

function ProjectCard({
  project,
  viewProjectLabel,
  openLiveLabel,
  statusLiveLabel,
  viewSourceLabel,
  onViewDetails,
  className,
}: ProjectCardProps) {
  const { lang } = useLanguage()
  const category = lang === 'ar' && project.categoryAr ? project.categoryAr : project.category

  return (
    <MagicBento
      enableSpotlight
      enableBorderGlow
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onViewDetails}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewDetails() } }}
      role="button"
      tabIndex={0}
      className={cn(
        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50',
        className
      )}
      innerClassName="flex flex-col bg-surface-1 hover:bg-surface-2 transition-colors duration-200"
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-surface-2">
        <img
          src={project.image}
          alt={project.title[lang]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status badge */}
        <div className="absolute top-3 start-3">
          <Badge variant="success">{statusLiveLabel}</Badge>
        </div>

        {/* Hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-card-title font-display text-ink">{project.title[lang]}</h3>

        <p className="text-caption text-accent font-medium uppercase tracking-wider">
          {category}
        </p>

        <p className="text-body-sm text-ink-muted leading-relaxed line-clamp-2">
          {project.shortDescription[lang]}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-pill bg-accent/10 px-2.5 py-1 text-caption font-medium text-accent transition-colors duration-150 hover:bg-accent/15"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onViewDetails() }}
            className="group/btn"
          >
            {viewProjectLabel}
          </Button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-medium text-ink-muted hover:text-accent transition-colors rounded-md"
            >
              <LuExternalLink size={14} />
              {openLiveLabel}
            </a>
          )}
          {project.githubUrl && viewSourceLabel && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-medium text-ink-muted hover:text-accent transition-colors rounded-md"
            >
              <FaGithub size={14} />
              {viewSourceLabel}
            </a>
          )}
        </div>
      </div>
    </MagicBento>
  )
}

export { ProjectCard, type ProjectCardProps }
