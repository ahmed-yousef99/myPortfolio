import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { LuMail, LuMessageCircle } from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { EMAIL, WHATSAPP_NUMBER, GITHUB_URL, LINKEDIN_URL } from '@/lib/contact'

const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

const quickLinkItems = [
  { key: 'services', href: '#services' },
  { key: 'projects', href: '#projects' },
  { key: 'process', href: '#process' },
  { key: 'pricing', href: '#pricing' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
]

const contactItems = [
  { icon: LuMessageCircle, href: `https://wa.me/${WHATSAPP_NUMBER}`, labelKey: 'contact.directLabels.whatsapp' },
  { icon: LuMail, href: GMAIL_COMPOSE, labelKey: 'contact.directLabels.email' },
  { icon: FaGithub, href: GITHUB_URL, labelKey: 'contact.directLabels.github' },
  { icon: FaLinkedin, href: LINKEDIN_URL, labelKey: 'contact.directLabels.linkedin' },
]

function Footer({ className }: FooterProps) {
  const { t, tArr } = useLanguage()
  const serviceLabels = tArr('footer.serviceItems')

  return (
    <footer
      className={cn(
        'border-t border-hairline bg-canvas pt-16 pb-8',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#"
              className="font-display text-sm font-semibold text-ink"
            >
              {t('nav.logo')}
            </a>
            <p className="mt-3 text-body-sm text-ink-subtle max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {contactItems.map((item) => (
                <a
                  key={item.labelKey}
                  href={item.href}
                  aria-label={t(item.labelKey)}
                  target={item.href.startsWith('#') ? undefined : '_blank'}
                  rel={item.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                  className="p-2 text-ink-subtle hover:text-ink transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50"
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-caption font-semibold text-ink-muted uppercase tracking-wider mb-3">
              {t('footer.quickLinks')}
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinkItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="text-body-sm text-ink-subtle hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50 rounded-sm"
                  >
                    {t(`nav.links.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-caption font-semibold text-ink-muted uppercase tracking-wider mb-3">
              {t('footer.services')}
            </h3>
            <ul className="flex flex-col gap-2">
              {serviceLabels.map((label) => (
                <li key={label}>
                  <a
                    href="#services"
                    className="text-body-sm text-ink-subtle hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50 rounded-sm"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-caption font-semibold text-ink-muted uppercase tracking-wider mb-3">
              {t('footer.contact')}
            </h3>
            <ul className="flex flex-col gap-2">
              {contactItems.map((item) => (
                <li key={item.labelKey}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('#') ? undefined : '_blank'}
                    rel={item.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-2 text-body-sm text-ink-subtle hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50 rounded-sm"
                  >
                    <item.icon size={14} className="text-accent shrink-0" />
{t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-hairline">
          <p className="text-caption text-ink-tertiary text-center">
            {t('footer.copyright').replace('{year}', String(new Date().getFullYear()))}
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer, type FooterProps }
