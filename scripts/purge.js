import readline from 'node:readline'

import {
  db,
  isProdMode,
} from './lib/firebaseAdmin.js'

/**
 * Ask the user for confirmation.
 */
async function askForConfirmation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const answer =
    await new Promise((resolve) => {
      rl.question(
        '\n⚠️  Type "yes" to continue: ',
        resolve,
      )
    })

  rl.close()

  return (
    answer
      .trim()
      .toLowerCase() === 'yes'
  )
}

/**
 * Delete every document in a collection,
 * including all nested subcollections.
 */
async function purgeCollection(
  collectionRef,
) {
  const snapshot =
    await collectionRef.get()

  for (const document of snapshot.docs) {
    console.log(
      `  Deleting ${document.ref.path}`,
    )

    await db.recursiveDelete(
      document.ref,
    )
  }
}

/**
 * Purge the entire Firestore database.
 */
async function purge() {
  console.log('')

  if (isProdMode) {
    console.log(
      '╔══════════════════════════════════════╗',
    )
    console.log(
      '║       ⚠️  PRODUCTION PURGE ⚠️       ║',
    )
    console.log(
      '╚══════════════════════════════════════╝',
    )

    console.log('')
    console.log(
      'THIS WILL DELETE ALL FIRESTORE DATA.',
    )
    console.log(
      'This operation cannot be undone.',
    )
    console.log('')

    const confirmed =
      await askForConfirmation()

    if (!confirmed) {
      console.log('')
      console.log(
        '❌ Purge cancelled.',
      )

      process.exit(0)
    }
  }

  console.log('')
  console.log(
    '🔥 Starting Firestore purge...',
  )
  console.log('')

  const collections =
    await db.listCollections()

  if (collections.length === 0) {
    console.log(
      'Database is already empty.',
    )

    return
  }

  for (const collection of collections) {
    console.log(
      `Purging collection: ${collection.id}`,
    )

    await purgeCollection(
      collection,
    )
  }

  console.log('')
  console.log(
    '✓ Firestore purge completed!',
  )
}

purge().catch((error) => {
  console.error('')
  console.error(
    '✗ Purge failed.',
  )
  console.error(error)

  process.exit(1)
})