import { useState, useEffect, useCallback } from 'react'
import { getEvents } from '../services/eventService'

export function useEvents(category = null) {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents(category)
      setEvents(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => { fetch() }, [fetch])

  return { events, loading, error, refetch: fetch }
}
