import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { LuX } from 'react-icons/lu'
import { cn } from '@/lib/utils'

interface ToastProps {
  open: boolean
  message: string
  onClose: () => void
  duration?: number
  variant?: 'success' | 'error'
  className?: string
}

function Toast({ open, message, onClose, duration = 5000, variant = 'success', className }: ToastProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onClose])

  const Icon = variant === 'error' ? FiAlertCircle : FiCheckCircle
  const iconColor = variant === 'error' ? 'text-semantic-error' : 'text-semantic-success'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' as const }}
          className={cn(
            'fixed top-4 end-4 z-[60] flex items-center gap-3',
            'bg-surface-1 border border-hairline rounded-lg px-4 py-3 shadow-xl',
            'text-body-sm text-ink',
            className,
          )}
          role="status"
          aria-live="polite"
        >
          <Icon size={18} className={cn('shrink-0', iconColor)} />
          <span className="flex-1">{message}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="p-0.5 text-ink-muted hover:text-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50"
          >
            <LuX size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { Toast, type ToastProps }
