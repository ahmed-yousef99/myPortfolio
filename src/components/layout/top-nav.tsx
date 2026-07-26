import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuMenu, LuX } from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { cn } from '@/lib/utils'
import { scrollToSection } from '@/lib/scroll'

const navItems = [
  { key: 'services', href: '#services' },
  { key: 'projects', href: '#projects' },
  { key: 'process', href: '#process' },
  { key: 'pricing', href: '#pricing' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
] as const

interface TopNavProps {
  className?: string
}

function TopNav({ className }: TopNavProps) {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-14 border-b border-hairline bg-canvas/80 backdrop-blur-md',
        className,
      )}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); scrollToSection('home') }}
          className="flex items-center gap-2"
          aria-label="Home"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 text-accent text-button font-semibold">
            AY
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={cn(
                'px-3 py-2 text-body-sm text-ink-muted hover:text-ink transition-colors duration-150 rounded-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50',
              )}
            >
              {t(`nav.links.${item.key}`)}
            </a>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={cn(
              'flex md:hidden items-center justify-center p-2 text-ink-muted hover:text-ink transition-colors rounded-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50',
            )}
          >
            {menuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-hairline bg-canvas md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'px-3 py-2.5 text-body text-ink-muted hover:text-ink transition-colors rounded-md',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50',
                  )}
                >
                  {t(`nav.links.${item.key}`)}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-hairline mt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export { TopNav, type TopNavProps }
