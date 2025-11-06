import React from 'react'

export const Label = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`mb-1 block text-sm font-medium ${className}`}>
    {children}
  </label>
)

export default Label