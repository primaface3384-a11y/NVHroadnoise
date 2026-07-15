import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'nvh-road-noise-db'
const DB_VERSION = 1

let dbInstance: IDBPDatabase | null = null

export async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('recordings')) {
        const store = db.createObjectStore('recordings', { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
      if (!db.objectStoreNames.contains('audio-data')) {
        db.createObjectStore('audio-data', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    },
  })

  return dbInstance
}
