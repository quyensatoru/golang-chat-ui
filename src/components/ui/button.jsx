import React from 'react'
import { cn } from '../../lib/utils'

export const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition'
  const variants = {
    default: 'bg-primary text-white hover:opacity-95',
    outline: 'border border-input bg-transparent',
    ghost: 'bg-transparent',
  }
  const sizes = {
    default: 'h-10 px-4 py-2',
    icon: 'h-8 w-8 p-0',
  }

  return (
    <button className={cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)} {...props}>
      {children}
    </button>
  )
}

export default Button