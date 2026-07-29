import api from './api'

/**
 * Sync the Firebase-authenticated user with the Spring Boot backend.
 * Called automatically after Firebase login.
 */
export async function syncUserWithBackend(token) {
  const response = await api.post(
    '/users/sync',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data.data
}

/**
 * Fetch the current user's profile from the backend.
 */
export async function getCurrentUser() {
  const response = await api.get('/users/me')
  return response.data.data
}
