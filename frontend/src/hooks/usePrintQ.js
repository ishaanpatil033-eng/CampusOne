import { useState, useEffect, useCallback } from 'react'
import { getMyPrintJobs } from '../services/printQService'

export function usePrintQOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyPrintJobs()
      setOrders(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load print jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { orders, loading, error, refetch: fetch }
}
