import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ShieldAlert, Users, Calendar, Search, Trash2, Shield } from 'lucide-react'
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteEvent,
  deleteLostFoundItem
} from '../../services/adminService'

// We will also reuse some existing hooks to display tables for events and lost-found,
// but for simplicity we will fetch them again or use the existing services.
import { getEvents } from '../../services/eventService'
import { getLostFoundItems } from '../../services/lostFoundService'

export default function AdminDashboard() {
  const { dbUser } = useAuth()
  
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users', 'events', 'items'

  useEffect(() => {
    if (dbUser?.role !== 'ADMIN') return
    loadData()
  }, [dbUser])

  async function loadData() {
    setLoading(true)
    try {
      const [sData, uData, eData, iData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getEvents(),
        getLostFoundItems()
      ])
      setStats(sData)
      setUsers(uData)
      setEvents(eData)
      setItems(iData)
    } catch (err) {
      console.error(err)
      alert("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId, newRole) {
    if (!window.confirm(`Change role to ${newRole}?`)) return
    try {
      await updateUserRole(userId, newRole)
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      alert("Failed to update role")
    }
  }

  async function handleDeleteEvent(id) {
    if (!window.confirm('Delete this event permanently?')) return
    try {
      await deleteEvent(id)
      setEvents(events.filter(e => e.id !== id))
      setStats(s => ({ ...s, totalEvents: s.totalEvents - 1 }))
    } catch (err) {
      alert("Failed to delete event")
    }
  }

  async function handleDeleteItem(id) {
    if (!window.confirm('Delete this item permanently?')) return
    try {
      await deleteLostFoundItem(id)
      setItems(items.filter(i => i.id !== id))
      setStats(s => ({ ...s, totalLostFoundItems: s.totalLostFoundItems - 1 }))
    } catch (err) {
      alert("Failed to delete item")
    }
  }

  if (dbUser?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-50 rounded-2xl">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
            <p className="text-slate-400 text-sm">System moderation and user management.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Events</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalEvents}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Lost & Found</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalLostFoundItems}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Announcements</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalAnnouncements}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex">
        <button onClick={() => setActiveTab('users')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'users' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}>User Management</button>
        <button onClick={() => setActiveTab('events')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'events' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}>Event Moderation</button>
        <button onClick={() => setActiveTab('items')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'items' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}>Lost & Found</button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                {activeTab === 'users' && (
                  <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Actions</th></tr>
                )}
                {activeTab === 'events' && (
                  <tr><th className="px-6 py-4">Event</th><th className="px-6 py-4">Organizer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Actions</th></tr>
                )}
                {activeTab === 'items' && (
                  <tr><th className="px-6 py-4">Item</th><th className="px-6 py-4">Reporter</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTab === 'users' && users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.displayName || 'Anonymous'}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : u.role === 'FACULTY' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs bg-slate-100 border-none rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary-500 cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {activeTab === 'events' && events.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{e.title}</td>
                    <td className="px-6 py-4 text-slate-500">{e.organizer}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteEvent(e.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'items' && items.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{i.title} <span className="text-xs text-slate-400">({i.type})</span></td>
                    <td className="px-6 py-4 text-slate-500">{i.reportedByName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${i.status === 'ACTIVE' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteItem(i.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(activeTab === 'users' && users.length === 0) || 
             (activeTab === 'events' && events.length === 0) || 
             (activeTab === 'items' && items.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-sm">No records found.</div>
            ) : null}
          </div>
        )}
      </div>

    </div>
  )
}
