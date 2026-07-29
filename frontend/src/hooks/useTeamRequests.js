import { useState, useEffect, useCallback } from 'react'
import { getTeamRequests } from '../services/teamRequestService'

export function useTeamRequests({ skill = null, status = null } = {}) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTeamRequests({ skill, status })
      setRequests(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load team requests')
    } finally {
      setLoading(false)
    }
  }, [skill, status])

  useEffect(() => { fetch() }, [fetch])

  return { requests, loading, error, refetch: fetch }
}
