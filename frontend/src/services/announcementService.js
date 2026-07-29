import api from './api'

/**
 * Fetch all active announcements.
 * @param {string|null} type - Optional filter: 'URGENT' | 'COLLEGE' | 'DEPARTMENT' | 'GENERAL'
 */
export async function getAnnouncements(type = null) {
  const params = type ? { type } : {}
  const response = await api.get('/announcements', { params })
  return response.data.data   // unwrap ApiResponse<List<AnnouncementResponse>>
}

/**
 * Fetch a single announcement by ID.
 */
export async function getAnnouncementById(id) {
  const response = await api.get(`/announcements/${id}`)
  return response.data.data
}

/**
 * Fetch announcement stats (e.g. urgentCount for badge).
 */
export async function getAnnouncementStats() {
  const response = await api.get('/announcements/stats')
  return response.data.data
}
