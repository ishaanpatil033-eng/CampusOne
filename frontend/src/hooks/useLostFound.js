import { useState, useEffect, useCallback } from 'react'
import { getLostFoundItems } from '../services/lostFoundService'

export function useLostFound({ type = null, keyword = null } = {}) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLostFoundItems({ type, keyword })
      setItems(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [type, keyword])

  useEffect(() => { fetch() }, [fetch])

  return { items, loading, error, refetch: fetch }
}
