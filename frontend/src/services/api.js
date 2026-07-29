import axios from 'axios'
import { auth } from '../firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Request interceptor: attach Firebase ID token ───────────
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser
    if (user) {
      try {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      } catch (err) {
        console.error('Failed to get Firebase token:', err)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle auth errors ────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expired or invalid — force re-authentication
      try {
        const user = auth.currentUser
        if (user) {
          await user.getIdToken(true) // Force refresh
          // Retry original request
          const originalRequest = error.config
          const newToken = await user.getIdToken()
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
