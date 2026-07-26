import { useState, type FormEvent } from 'react'
import { motion, type Variants } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import {
  LuMessageCircle,
  LuMail,
  LuSend,
  LuLoader,
} from 'react-icons/lu'
import { useLanguage } from '@/hooks/useLanguage'
import { Input, Textarea } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import {
  WHATSAPP_NUMBER,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
} from '@/lib/contact'

const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`

const EMAILJS_SERVICE_ID = 'service_kzwse3j'
const EMAILJS_TEMPLATE_ID = 'template_hu98fn5'
const EMAILJS_PUBLIC_KEY = 'KbZLq68EoRxPQIRKo'

interface FormState {
  name: string
  email: string
  type: string
  details: string
}

interface FormErrors {
  name?: string
  email?: string
  details?: string
}

const directContacts = [
  { key: 'whatsapp', icon: LuMessageCircle, href: `https://wa.me/${WHATSAPP_NUMBER}`, labelKey: 'contact.directLabels.whatsapp' },
  { key: 'email', icon: LuMail, href: GMAIL_COMPOSE, labelKey: 'contact.directLabels.email' },
  { key: 'github', icon: FaGithub, href: GITHUB_URL, labelKey: 'contact.directLabels.github' },
  { key: 'linkedin', icon: FaLinkedin, href: LINKEDIN_URL, labelKey: 'contact.directLabels.linkedin' },
]

const selectBase =
  'w-full bg-surface-1 text-ink rounded-md border border-hairline px-3 py-2 text-body transition-colors duration-150 focus:outline-none focus:border-accent-focus focus:ring-2 focus:ring-accent-focus/50 appearance-none cursor-pointer'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const } }),
}

interface ContactProps {
  className?: string
}

function Contact({ className }: ContactProps) {
  const { t, tArr, lang } = useLanguage()
  const [sending, setSending] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success')

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    type: '',
    details: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const typeOptions = tArr('contact.typeOptions')

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = t('contact.errors.name')
    if (!form.email.trim()) next.email = t('contact.errors.email')
    if (!form.details.trim()) next.details = t('contact.errors.details')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSending(true)

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: t('contact.title'),
          user_name: form.name,
          project_type: form.type || 'Not specified',
          project_details: form.details,
          name: form.name,
          email: form.email,
        },
        EMAILJS_PUBLIC_KEY,
      )

      setForm({
        name: '',
        email: '',
        type: '',
        details: '',
      })
      setErrors({})
      setToastMessage(t('contact.success'))
      setToastVariant('success')
      setToastOpen(true)
    } catch {
      setToastMessage(t('contact.error'))
      setToastVariant('error')
      setToastOpen(true)
    } finally {
      setSending(false)
    }
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  return (
    <section id="contact" className={cn('py-section', className)}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <motion.div
          
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start"
        >
          {/* Left: info */}
          <motion.div variants={itemVariants}
            custom={typeof index !== "undefined" ? index : 0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }} className="relative flex flex-col gap-6">
            <div
              className="pointer-events-none absolute -top-20 -start-20 w-64 h-64 opacity-10"
              style={{
                background: 'radial-gradient(circle, rgba(94,106,210,0.3), transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-headline font-display text-ink">
                {t('contact.title')}
              </h2>
              <p className="text-body-lg text-ink-muted leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {directContacts.map(({ key, icon: Icon, href, labelKey }) => (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith('#') ? undefined : '_blank'}
                  rel={href.startsWith('#') ? undefined : 'noopener noreferrer'}
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-lg',
                    'bg-surface-1 border border-hairline',
                    'hover:bg-surface-2 hover:border-hairline-strong',
                    'hover:-translate-y-0.5 transition-all duration-200',
                    'text-body-sm text-ink-muted hover:text-ink',
                  )}
                >
                  <Icon size={16} className="shrink-0 text-accent" />
                  <span>{t(labelKey)}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div variants={itemVariants}
            custom={typeof index !== "undefined" ? index : 0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-6 rounded-xl bg-surface-1 border border-hairline"
              noValidate
            >
              <Input
                placeholder={t('contact.placeholder.name')}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                error={errors.name}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />

              <Input
                placeholder={t('contact.placeholder.email')}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                type="email"
              />

              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => set('type', e.target.value)}
                  className={selectBase}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">{t('contact.form.type')}</option>
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <Textarea
                placeholder={t('contact.placeholder.details')}
                value={form.details}
                onChange={(e) => set('details', e.target.value)}
                error={errors.details}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                rows={4}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={sending}
              >
                {sending ? (
                  <LuLoader size={16} className="animate-spin" />
                ) : (
                  <LuSend size={16} />
                )}
                {sending ? t('contact.form.sending') : t('contact.form.submit')}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
        duration={5000}
      />
    </section>
  )
}

export { Contact, type ContactProps }

