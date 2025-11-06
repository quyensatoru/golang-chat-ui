
import React from 'react'

export const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-card text-card-foreground p-4 shadow-sm ${className}`}>{children}</div>
)

export const CardHeader = ({ children, className = '' }) => <div className={`mb-2 ${className}`}>{children}</div>
export const CardTitle = ({ children, className = '' }) => <h3 className={`text-lg font-semibold text-card-foreground ${className}`}>{children}</h3>
export const CardContent = ({ children, className = '' }) => <div className={`my-2 text-card-foreground ${className}`}>{children}</div>
export const CardFooter = ({ children, className = '' }) => <div className={`mt-4 text-card-foreground ${className}`}>{children}</div>

export default Card