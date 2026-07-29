import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth()

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Left panel - branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-16 py-12">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">CampusOne</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Your campus,
            <span className="block text-primary-300">unified.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Manage courses, track assignments, view schedules, and connect
            with your campus community — all in one place.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Students', value: '10K+' },
              { label: 'Courses',  value: '500+' },
              { label: 'Uptime',   value: '99.9%' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - auth form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">CampusOne</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
