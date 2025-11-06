import React from 'react'

export const Input = ({ className = '', type = 'text', ...props }) => {
  return <input type={type} className={`w-full rounded-md border px-3 py-2 bg-input text-sm ${className}`} {...props} />
}

export default Input