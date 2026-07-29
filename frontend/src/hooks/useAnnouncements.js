import { useState, useEffect, useCallback } from 'react'
import { getAnnouncements } from '../services/announcementService'

/**
 * Custom hook to fetch and manage announcements.
 * Handles loading, error, and refetch states.
 *
 * @param {string|null} type - Optional type filter
 */
export function useAnnouncements(type = null) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAnnouncements(type)
      setAnnouncements(data)
    } catch (err) {
      const message = err.response?.data?.message
        || err.message
        || 'Failed to load announcements'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => { fetch() }, [fetch])

  return { announcements, loading, error, refetch: fetch }
}
