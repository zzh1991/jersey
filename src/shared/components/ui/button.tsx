import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-blue-500 text-white hover:bg-blue-400': variant === 'default',
            'border border-white/[0.08] bg-transparent hover:bg-white/[0.04]': variant === 'outline',
            'hover:bg-white/[0.04]': variant === 'ghost',
            'bg-red-500/10 text-red-400 hover:bg-red-500/20': variant === 'destructive',
            'h-10 px-4 py-2 rounded-lg': size === 'default',
            'h-8 px-3 rounded-md text-sm': size === 'sm',
            'h-12 px-6 rounded-xl text-lg': size === 'lg',
            'h-10 w-10 rounded-lg': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
