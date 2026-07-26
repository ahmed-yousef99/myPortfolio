import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const baseClasses =
  'w-full bg-surface-1 text-ink placeholder:text-ink-tertiary rounded-md border border-hairline px-3 py-2 text-body transition-colors duration-150 focus:outline-none focus:border-accent-focus focus:ring-2 focus:ring-accent-focus/50'

const errorClasses =
  'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          className={cn(baseClasses, error && errorClasses, className)}
          {...props}
        />
        {error && (
          <span className="text-caption text-red-400">{error}</span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <textarea
          ref={ref}
          className={cn(
            baseClasses,
            'min-h-[100px] resize-y',
            error && errorClasses,
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-caption text-red-400">{error}</span>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export { Input, Textarea, type InputProps, type TextareaProps }
