import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute  from './components/common/ProtectedRoute'
import AuthLayout      from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login           from './pages/auth/Login'
import Register        from './pages/auth/Register'
import Dashboard       from './pages/dashboard/Dashboard'
import StudyHub        from './pages/studyhub/StudyHub'
import TeamUp          from './pages/teamup/TeamUp'
import EventHub        from './pages/events/EventHub'
import LostFound       from './pages/lostfound/LostFound'
import SmartCanteen    from './pages/canteen/SmartCanteen'
import PrintQ          from './pages/printq/PrintQ'
import AdminDashboard  from './pages/admin/AdminDashboard'
import NotFound        from './pages/NotFound'
import Spinner         from './components/ui/Spinner'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="white" />
          <p className="mt-4 text-white/70 text-sm font-medium">Initializing CampusOne...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-hub" element={<StudyHub />}  />
          <Route path="/teamup"    element={<TeamUp />}    />
          <Route path="/events"    element={<EventHub />}  />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/canteen"   element={<SmartCanteen />} />
          <Route path="/printq"    element={<PrintQ />} />
          <Route path="/admin"     element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
