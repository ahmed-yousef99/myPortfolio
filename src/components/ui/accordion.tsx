import { useState, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LuChevronDown } from 'react-icons/lu'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

interface AccordionProps {
  children: ReactNode
  className?: string
}

function Accordion({ className, children }: AccordionProps) {
  return <div className={cn('divide-y divide-hairline', className)}>{children}</div>
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  const handleToggle = () => {
    setOpen((prev) => !prev)
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }

  return (
    <div className="py-3">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-3 text-left text-body font-medium text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus/50 focus-visible:rounded-md',
          'transition-colors duration-150 hover:text-ink-muted',
        )}
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-ink-muted"
        >
          <LuChevronDown size={16} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? contentHeight : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div
          ref={(node) => {
            contentRef.current = node
            if (node && node.scrollHeight > contentHeight) {
              setContentHeight(node.scrollHeight)
            }
          }}
          className="pt-3 text-body-sm text-ink-muted"
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export { Accordion, AccordionItem, type AccordionProps, type AccordionItemProps }
