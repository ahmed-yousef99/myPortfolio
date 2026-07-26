import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  className?: string
}

function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      className={cn(
        'relative inline-flex items-center gap-1.5 px-2 py-1 text-caption font-medium',
        'text-ink-muted hover:text-ink transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50 focus-visible:rounded-md',
        className,
      )}
    >
      <span
        className={cn(
          'transition-opacity duration-150',
          lang === 'en' ? 'opacity-100' : 'opacity-40',
        )}
      >
        EN
      </span>
      <span className="text-hairline-strong">/</span>
      <span
        className={cn(
          'transition-opacity duration-150',
          lang === 'ar' ? 'opacity-100' : 'opacity-40',
        )}
      >
        AR
      </span>
    </button>
  )
}

export { LanguageSwitcher, type LanguageSwitcherProps }
