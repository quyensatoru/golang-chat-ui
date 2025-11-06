import React from 'react'

export const Avatar = ({ children, className = '', ...props }) => {
  return (
    <div className={`inline-flex overflow-hidden rounded-full ${className}`} {...props}>
      {children}
    </div>
  )
}

export const AvatarImage = ({ src, alt }) => <img src={src} alt={alt} className="h-full w-full object-cover" />
export const AvatarFallback = ({ children }) => <div className="flex h-full w-full items-center justify-center bg-muted text-xs">{children}</div>

export default Avatar