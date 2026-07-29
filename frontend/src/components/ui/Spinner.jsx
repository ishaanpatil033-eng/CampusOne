import React from 'react'

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
}

const colorMap = {
  primary: 'border-primary-600',
  white:   'border-white',
  gray:    'border-slate-400',
}

export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  return (
    <div
      className={`
        ${sizeMap[size]}
        border-2 border-t-transparent rounded-full animate-spin
        ${colorMap[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}
