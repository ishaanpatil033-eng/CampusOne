import api from './api'

export async function getStudyMaterials(subject = null, department = null) {
  const params = {}
  if (subject)    params.subject    = subject
  if (department) params.department = department
  const response = await api.get('/study-materials', { params })
  return response.data.data
}

export async function createStudyMaterial(data) {
  const response = await api.post('/study-materials', data)
  return response.data.data
}

export async function getStudyMaterialById(id) {
  const response = await api.get(`/study-materials/${id}`)
  return response.data.data
}
