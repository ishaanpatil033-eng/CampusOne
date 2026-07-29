import api from './api'

export async function getTeamRequests({ skill = null, status = null } = {}) {
  const params = {}
  if (skill)  params.skill  = skill
  if (status) params.status = status
  const response = await api.get('/team-requests', { params })
  return response.data.data
}

export async function createTeamRequest(data) {
  const response = await api.post('/team-requests', data)
  return response.data.data
}

export async function toggleTeamRequestStatus(id) {
  const response = await api.patch(`/team-requests/${id}/toggle-status`)
  return response.data.data
}
