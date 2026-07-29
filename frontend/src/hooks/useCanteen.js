import { useState, useEffect, useCallback } from 'react'
import { getMyOrders } from '../services/canteenService'

export function useCanteenOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { orders, loading, error, refetch: fetch }
}
