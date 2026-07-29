import api from './api'

export async function getMyOrders() {
  const response = await api.get('/canteen/orders/me')
  return response.data.data
}

export async function placeOrder(items, totalAmount) {
  const response = await api.post('/canteen/orders', { items, totalAmount })
  return response.data.data
}
