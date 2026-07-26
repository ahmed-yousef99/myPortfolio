import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const variants = ['primary', 'secondary', 'tertiary', 'inverse'] as const
const sizes = ['sm', 'md', 'lg'] as const

type ButtonVariant = (typeof variants)[number]
type ButtonSize = (typeof sizes)[number]

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-on-accent hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-accent-focus focus-visible:outline-offset-2',
  secondary:
    'bg-surface-1 text-ink border border-hairline hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-focus focus-visible:outline-offset-2',
  tertiary:
    'bg-transparent text-ink hover:text-ink-muted focus-visible:outline-2 focus-visible:outline-accent-focus focus-visible:outline-offset-2',
  inverse:
    'bg-inverse-canvas text-inverse-ink hover:bg-inverse-surface-1 focus-visible:outline-2 focus-visible:outline-accent-focus focus-visible:outline-offset-2',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-caption rounded-md',
  md: 'px-3.5 py-2 text-button rounded-md',
  lg: 'px-5 py-2.5 text-button rounded-md',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-text font-medium transition-colors duration-150',
          'focus-visible:outline-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize }
