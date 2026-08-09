import { db } from './lib/firebaseAdmin.js'

async function migrateMemberships() {
  console.log('Starting membership migration...')

  const roomsSnapshot =
    await db.collection('rooms').get()

  let membershipCount = 0

  for (const roomDoc of roomsSnapshot.docs) {
    const roomCode = roomDoc.id
    const roomData = roomDoc.data()

    console.log(
      `Processing room: ${roomCode}`,
    )

    /*
     * Master membership
     */
    if (roomData.masterId) {
      const membershipRef = db
        .collection('users')
        .doc(roomData.masterId)
        .collection('memberships')
        .doc(roomCode)

      await membershipRef.set(
        {
          roomCode,
          role: 'master',
        },
        {
          merge: true,
        },
      )

      membershipCount++

      console.log(
        `  + master: ${roomData.masterId}`,
      )
    }

    /*
     * Player memberships
     */
    const playersSnapshot =
      await db
        .collection('rooms')
        .doc(roomCode)
        .collection('players')
        .get()

    for (
      const playerDoc
      of playersSnapshot.docs
    ) {
      const userId = playerDoc.id

      const membershipRef = db
        .collection('users')
        .doc(userId)
        .collection('memberships')
        .doc(roomCode)

      await membershipRef.set(
        {
          roomCode,
          role: 'player',
        },
        {
          merge: true,
        },
      )

      membershipCount++

      console.log(
        `  + player: ${userId}`,
      )
    }
  }

  console.log('')
  console.log(
    `Migration complete. Created/updated ${membershipCount} memberships.`,
  )
}

migrateMemberships().catch((error) => {
  console.error(
    'Membership migration failed:',
    error,
  )

  process.exit(1)
})