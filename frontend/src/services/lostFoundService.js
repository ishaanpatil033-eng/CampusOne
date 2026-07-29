import api from './api'

export async function getLostFoundItems({ type = null, keyword = null } = {}) {
  const params = {}
  if (type)    params.type = type
  if (keyword) params.q    = keyword
  const response = await api.get('/lost-found', { params })
  return response.data.data
}

export async function getLostFoundItemById(id) {
  const response = await api.get(`/lost-found/${id}`)
  return response.data.data
}

export async function reportLostFoundItem(data) {
  const response = await api.post('/lost-found', data)
  return response.data.data
}

export async function markAsClaimed(id) {
  const response = await api.patch(`/lost-found/${id}/claim`)
  return response.data.data
}
