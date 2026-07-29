import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import StatsGrid       from '../../components/dashboard/StatsGrid'
import QuickShortcuts  from '../../components/dashboard/QuickShortcuts'
import UpcomingEvents  from '../../components/dashboard/UpcomingEvents'
import TeamRequests    from '../../components/dashboard/TeamRequests'
import AnnouncementsFeed from '../../components/announcements/AnnouncementsFeed'

export default function Dashboard() {
  const { firebaseUser, dbUser } = useAuth()

  const firstName = (dbUser?.displayName || firebaseUser?.displayName || 'there')
    .split(' ')[0]

  const hour = new Date().getHours()
  const greeting =
    hour < 5  ? '🌙 Good night'     :
    hour < 12 ? '☀️ Good morning'   :
    hour < 17 ? '👋 Good afternoon' :
                '🌇 Good evening'

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}, {firstName}!
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{today}</p>
        </div>
        {dbUser?.role && (
          <span className="self-start sm:self-auto inline-flex items-center px-3 py-1.5
                           rounded-xl text-sm font-semibold bg-primary-50 text-primary-700
                           border border-primary-100">
            {dbUser.role.charAt(0) + dbUser.role.slice(1).toLowerCase()}
          </span>
        )}
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <StatsGrid />

      {/* ── Main content grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left column — Announcements feed (takes 2 of 3 columns) */}
        <div className="xl:col-span-2 space-y-6">
          <AnnouncementsFeed />
        </div>

        {/* Right column — Quick access + sidebar widgets */}
        <div className="space-y-6">
          <QuickShortcuts />
          <UpcomingEvents />
          <TeamRequests />
        </div>

      </div>
    </div>
  )
}
