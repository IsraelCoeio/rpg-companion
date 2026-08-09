import { readFile } from 'node:fs/promises'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const credentialsPath =
  'C:/Users/israe/.firebase/rpg-companion-9564c-firebase-adminsdk-fbsvc-844c53f40e.json'

const credentials = JSON.parse(
  await readFile(credentialsPath, 'utf8'),
)

initializeApp({
  credential: cert(credentials),
})

const db = getFirestore()

console.log('Connecting to Firebase...')

try {
  const snapshot = await db.collection('rooms').get()

  console.log('')
  console.log('✓ Connected!')
  console.log('')
  console.log('Rooms:')

  if (snapshot.empty) {
    console.log('  (no rooms found)')
  } else {
    for (const doc of snapshot.docs) {
      console.log(`  ${doc.id}`)
    }
  }

  console.log('')
  console.log('✓ Admin SDK is working.')
} catch (error) {
  console.error('')
  console.error('✗ Failed to connect to Firebase.')
  console.error(error)
  process.exit(1)
}