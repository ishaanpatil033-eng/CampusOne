import api from './api'

export async function getMyPrintJobs() {
  const response = await api.get('/printq/orders/me')
  return response.data.data
}

export async function submitPrintJob(data) {
  const response = await api.post('/printq/orders', data)
  return response.data.data
}
