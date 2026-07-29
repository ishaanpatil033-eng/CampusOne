import React from 'react'
import Spinner from './Spinner'

const variants = {
  primary:  'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 focus:ring-primary-500',
  secondary:'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-300',
  danger:   'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 focus:ring-red-500',
  ghost:    'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
  outline:  'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 focus:ring-slate-300',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  full: 'w-full px-4 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-200 transform hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'gray'} />}
      {children}
    </button>
  )
}
