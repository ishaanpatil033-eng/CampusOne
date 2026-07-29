import api from './api'

export async function getAdminStats() {
  const response = await api.get('/admin/stats')
  return response.data.data
}

export async function getAllUsers() {
  const response = await api.get('/admin/users')
  return response.data.data
}

export async function updateUserRole(userId, role) {
  const response = await api.patch(`/admin/users/${userId}/role?role=${role}`)
  return response.data.data
}

export async function deleteEvent(eventId) {
  const response = await api.delete(`/admin/events/${eventId}`)
  return response.data
}

export async function deleteLostFoundItem(itemId) {
  const response = await api.delete(`/admin/lost-found/${itemId}`)
  return response.data
}
