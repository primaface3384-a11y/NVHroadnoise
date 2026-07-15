'use client'
import { useState, useEffect, useCallback } from 'react'
import { getAllRecordings, deleteRecording, updateRecording } from '@/lib/storage/recording-store'
import type { RecordingMetadata } from '@/types/recording'

export function useRecordings() {
  const [recordings, setRecordings] = useState<RecordingMetadata[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getAllRecordings()
    setRecordings(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await deleteRecording(id)
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const update = useCallback(async (id: string, updates: Partial<RecordingMetadata>) => {
    await updateRecording(id, updates)
    setRecordings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    )
  }, [])

  return { recordings, loading, refresh, remove, update }
}
