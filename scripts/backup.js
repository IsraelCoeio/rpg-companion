import path from 'node:path'
import {
  mkdir,
  writeFile,
} from 'node:fs/promises'

import {
  db,
  isProdMode,
} from './lib/firebaseAdmin.js'

const backupDirectory =
  path.resolve('backups')

/**
 * Converts Firestore values into
 * JSON-safe values.
 *
 * Firestore contains special values such as:
 *
 * - Timestamp
 * - GeoPoint
 * - DocumentReference
 * - Bytes
 *
 * We preserve those values instead of
 * simply doing JSON.stringify().
 */
function serializeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return value
  }

  // Firestore Timestamp
  if (
    typeof value === 'object' &&
    typeof value.toDate === 'function'
  ) {
    return {
      __type: 'timestamp',
      value: value
        .toDate()
        .toISOString(),
    }
  }

  // JavaScript Date
  if (value instanceof Date) {
    return {
      __type: 'timestamp',
      value: value.toISOString(),
    }
  }

  // Firestore GeoPoint
  if (
    typeof value === 'object' &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number'
  ) {
    return {
      __type: 'geopoint',
      latitude: value.latitude,
      longitude: value.longitude,
    }
  }

  // Firestore DocumentReference
  if (
    typeof value === 'object' &&
    typeof value.path === 'string'
  ) {
    return {
      __type: 'reference',
      path: value.path,
    }
  }

  // Firestore Bytes
  if (Buffer.isBuffer(value)) {
    return {
      __type: 'bytes',
      value: value.toString('base64'),
    }
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map(serializeValue)
  }

  // Nested objects
  if (typeof value === 'object') {
    const result = {}

    for (
      const [key, nestedValue]
      of Object.entries(value)
    ) {
      result[key] =
        serializeValue(nestedValue)
    }

    return result
  }

  return value
}

/**
 * Recursively exports a collection
 * and all of its documents and
 * subcollections.
 */
async function exportCollection(
  collectionRef,
) {
  const snapshot =
    await collectionRef.get()

  const documents = {}

  for (
    const document of snapshot.docs
  ) {
    const documentData =
      document.data()

    const subcollections =
      await document.ref.listCollections()

    const exportedSubcollections = {}

    for (
      const subcollection
      of subcollections
    ) {
      exportedSubcollections[
        subcollection.id
      ] = await exportCollection(
        subcollection,
      )
    }

    documents[document.id] = {
      data:
        serializeValue(
          documentData,
        ),

      subcollections:
        exportedSubcollections,
    }
  }

  return documents
}

/**
 * Creates a complete Firestore
 * backup.
 *
 * By default this targets the
 * Firestore emulator.
 *
 * Use --prod to target production.
 */
async function createBackup() {
  console.log('')
  console.log(
    '🔥 FIRESTORE BACKUP',
  )
  console.log(
    `Target: ${
      isProdMode
        ? 'PRODUCTION'
        : 'EMULATOR'
    }`,
  )
  console.log('')

  const rootCollections =
    await db.listCollections()

  const target =
    isProdMode
      ? 'production'
      : 'emulator'

  const backup = {
    metadata: {
      projectId:
        process.env.VITE_FIREBASE_PROJECT_ID ||
        'rpg-companion-9564c',

      target,

      createdAt:
        new Date().toISOString(),

      formatVersion: 1,
    },

    collections: {},
  }

  for (
    const collection
    of rootCollections
  ) {
    console.log(
      `Backing up collection: ${collection.id}`,
    )

    backup.collections[
      collection.id
    ] =
      await exportCollection(
        collection,
      )
  }

  await mkdir(
    backupDirectory,
    {
      recursive: true,
    },
  )

  const timestamp =
    new Date()
      .toISOString()
      .replace(
        /[:.]/g,
        '-',
      )

  const fileName =
    `backup_${target}_${timestamp}.json`

  const filePath =
    path.join(
      backupDirectory,
      fileName,
    )

  await writeFile(
    filePath,
    JSON.stringify(
      backup,
      null,
      2,
    ),
    'utf8',
  )

  console.log('')
  console.log(
    '✓ Backup completed!',
  )
  console.log('')
  console.log(
    'Saved to:',
  )
  console.log(
    `  ${filePath}`,
  )
}

createBackup().catch(
  (error) => {
    console.error('')
    console.error(
      '✗ Backup failed.',
    )
    console.error(error)

    process.exit(1)
  },
)