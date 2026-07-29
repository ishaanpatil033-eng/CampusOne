import { useState, useEffect, useCallback } from 'react'
import { getStudyMaterials } from '../services/studyMaterialService'

export function useStudyMaterials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getStudyMaterials()
      setMaterials(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load materials')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { materials, loading, error, refetch: fetch }
}
