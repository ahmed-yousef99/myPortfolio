import { FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP_NUMBER } from '@/lib/contact'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'
import { trackWhatsappClick } from '@/lib/analytics'

interface FloatingWhatsAppProps {
  className?: string
}

function FloatingWhatsApp({ className }: FloatingWhatsAppProps) {
  const { t } = useLanguage()
  const href = `https://wa.me/${WHATSAPP_NUMBER}`

  return (
    <div className={cn('fixed bottom-6 end-6 z-50 group', className)}>
      <div className="hidden [@media(hover:hover)]:block absolute z-10 bottom-full end-0 mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 motion-safe:transition-all motion-safe:duration-200 pointer-events-none">
        <div className="bg-surface-1 border border-hairline rounded-lg shadow-lg px-3 py-2 text-sm text-ink-muted whitespace-nowrap">
          {t('whatsapp.tooltip')}
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappClick('floating_button')}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] hover:scale-105 hover:shadow-xl motion-safe:transition-all motion-safe:duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        aria-label="Contact me on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  )
}

export { FloatingWhatsApp }
