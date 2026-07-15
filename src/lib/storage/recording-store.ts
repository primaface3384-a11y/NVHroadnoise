import { getDB } from './db'
import type { RecordingMetadata, AudioDataRecord } from '@/types/recording'

export async function saveRecording(recording: RecordingMetadata): Promise<void> {
  const db = await getDB()
  await db.put('recordings', recording)
}

export async function getRecording(id: string): Promise<RecordingMetadata | undefined> {
  const db = await getDB()
  return db.get('recordings', id)
}

export async function getAllRecordings(): Promise<RecordingMetadata[]> {
  const db = await getDB()
  const all = await db.getAll('recordings')
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('recordings', id)
  await db.delete('audio-data', id)
}

export async function updateRecording(
  id: string,
  updates: Partial<RecordingMetadata>,
): Promise<void> {
  const db = await getDB()
  const existing = await db.get('recordings', id)
  if (!existing) return
  await db.put('recordings', { ...existing, ...updates })
}

export async function saveAudioData(data: AudioDataRecord): Promise<void> {
  const db = await getDB()
  await db.put('audio-data', data)
}

export async function getAudioData(id: string): Promise<AudioDataRecord | undefined> {
  const db = await getDB()
  return db.get('audio-data', id)
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDB()
  const result = await db.get('settings', key)
  return result ? result.value : defaultValue
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key, value })
}
