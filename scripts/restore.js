import { readFile } from 'node:fs/promises'
import readline from 'node:readline'

import {
  Timestamp,
  GeoPoint,
} from 'firebase-admin/firestore'

import {
  db,
  isProdMode,
} from './lib/firebaseAdmin.js'


/**
 * Converts backup JSON values back
 * into Firestore-compatible values.
 *
 * Supported special values:
 *
 * - Timestamp
 * - GeoPoint
 * - DocumentReference
 * - Bytes
 */
function deserializeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return value
  }


  // Firestore Timestamp
  if (
    typeof value === 'object' &&
    value.__type === 'timestamp'
  ) {
    return Timestamp.fromDate(
      new Date(value.value),
    )
  }


  // Firestore GeoPoint
  if (
    typeof value === 'object' &&
    value.__type === 'geopoint'
  ) {
    return new GeoPoint(
      value.latitude,
      value.longitude,
    )
  }


  // Firestore DocumentReference
  if (
    typeof value === 'object' &&
    value.__type === 'reference'
  ) {
    return db.doc(value.path)
  }


  // Firestore Bytes
  if (
    typeof value === 'object' &&
    value.__type === 'bytes'
  ) {
    return Buffer.from(
      value.value,
      'base64',
    )
  }


  // Arrays
  if (Array.isArray(value)) {
    return value.map(
      deserializeValue,
    )
  }


  // Nested objects
  if (
    typeof value === 'object'
  ) {
    const result = {}

    for (
      const [
        key,
        nestedValue,
      ]
      of Object.entries(value)
    ) {
      result[key] =
        deserializeValue(
          nestedValue,
        )
    }

    return result
  }


  return value
}


/**
 * Recursively restores a collection
 * and all of its documents and
 * subcollections.
 */
async function restoreCollection(
  collectionRef,
  documents,
) {
  for (
    const [
      documentId,
      documentData,
    ]
    of Object.entries(documents)
  ) {
    const documentRef =
      collectionRef.doc(
        documentId,
      )

    const data =
      deserializeValue(
        documentData.data,
      )

    await documentRef.set(data)

    console.log(
      `  ✓ ${documentRef.path}`,
    )


    const subcollections =
      documentData.subcollections ||
      {}


    for (
      const [
        subcollectionId,
        subcollectionDocuments,
      ]
      of Object.entries(
        subcollections,
      )
    ) {
      await restoreCollection(
        documentRef.collection(
          subcollectionId,
        ),
        subcollectionDocuments,
      )
    }
  }
}


/**
 * Ask the user for interactive
 * confirmation.
 */
function askConfirmation(
  question,
) {
  const rl =
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

  return new Promise(
    (resolve) => {
      rl.question(
        question,
        (answer) => {
          rl.close()

          resolve(
            answer.trim(),
          )
        },
      )
    },
  )
}


/**
 * Verify production restore
 * before writing anything.
 */
async function confirmProductionRestore(
  backup,
) {
  console.log('')
  console.log(
    '╔══════════════════════════════════════════════╗',
  )
  console.log(
    '║       ⚠️  PRODUCTION RESTORE WARNING       ║',
  )
  console.log(
    '╚══════════════════════════════════════════════╝',
  )
  console.log('')

  console.log(
    'You are about to restore data into',
  )

  console.log(
    'THE LIVE PRODUCTION FIRESTORE DATABASE.',
  )

  console.log('')

  console.log(
    `Backup created: ${
      backup.metadata.createdAt
    }`,
  )

  console.log(
    `Backup target: ${
      backup.metadata.target ||
      'unknown'
    }`,
  )

  console.log('')

  console.log(
    '⚠️  This operation will WRITE data',
  )

  console.log(
    '    into the production database.',
  )

  console.log('')

  console.log(
    'This script does NOT automatically',
  )

  console.log(
    'create a production backup.',
  )

  console.log('')

  const answer =
    await askConfirmation(
      'Type RESTORE-PRODUCTION to continue: ',
    )

  if (
    answer !==
    'RESTORE-PRODUCTION'
  ) {
    console.log('')
    console.log(
      '❌ Production restore cancelled.',
    )

    process.exit(0)
  }

  console.log('')
  console.log(
    '✓ Production restore confirmed.',
  )
  console.log('')
}


/**
 * Main restore operation.
 */
async function restore() {
  const args = process.argv.slice(2)

  const backupPath =
    args.find(
      (argument) =>
        !argument.startsWith('--'),
    )


  if (!backupPath) {
    console.error('')
    console.error(
      'Usage:',
    )

    console.error(
      '  npm run db:restore -- backups/file.json',
    )

    console.error(
      '  npm run db:restore -- backups/file.json --prod',
    )

    console.error('')

    process.exit(1)
  }


  console.log('')
  console.log(
    '🔥 FIRESTORE RESTORE',
  )

  console.log(
    `Target: ${
      isProdMode
        ? 'PRODUCTION'
        : 'EMULATOR'
    }`,
  )

  console.log(
    `Backup: ${backupPath}`,
  )

  console.log('')

  if (!backupPath.toLowerCase().endsWith('.json')) {
    throw new Error(
      `Backup file must be a .json file: ${backupPath}`,
    )
  }
  // Read backup
  const file =
    await readFile(
      backupPath,
      'utf8',
    )

  const backup =
    JSON.parse(file)


  // Validate backup
  if (
    !backup.metadata ||
    !backup.collections
  ) {
    throw new Error(
      'Invalid backup file.',
    )
  }


  console.log(
    `Backup created: ${
      backup.metadata.createdAt
    }`,
  )

  console.log(
    `Backup target: ${
      backup.metadata.target ||
      'unknown'
    }`,
  )

  console.log(
    `Format version: ${
      backup.metadata.formatVersion ||
      'unknown'
    }`,
  )

  console.log('')


  /*
   * Production safety check.
   */
  if (isProdMode) {
    await confirmProductionRestore(
      backup,
    )
  }


  /*
   * Restore every root collection.
   */
  for (
    const [
      collectionId,
      documents,
    ]
    of Object.entries(
      backup.collections,
    )
  ) {
    console.log(
      `Restoring collection: ${collectionId}`,
    )

    await restoreCollection(
      db.collection(
        collectionId,
      ),
      documents,
    )
  }


  console.log('')
  console.log(
    '✓ Restore completed!',
  )
  console.log('')
}


restore().catch(
  (error) => {
    console.error('')
    console.error(
      '✗ Restore failed.',
    )
    console.error(error)

    process.exit(1)
  },
)