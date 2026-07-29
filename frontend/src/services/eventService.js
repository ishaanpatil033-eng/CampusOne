import api from './api'

export async function getEvents(category = null) {
  const params = category ? { category } : {}
  const response = await api.get('/events', { params })
  return response.data.data
}

export async function getEventById(id) {
  const response = await api.get(`/events/${id}`)
  return response.data.data
}

export async function createEvent(data) {
  const response = await api.post('/events', data)
  return response.data.data
}

export async function registerForEvent(id) {
  const response = await api.post(`/events/${id}/register`)
  return response.data.data
}

export async function unregisterFromEvent(id) {
  const response = await api.delete(`/events/${id}/register`)
  return response.data.data
}
