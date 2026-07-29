import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 mt-4 mb-2">Page not found</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
