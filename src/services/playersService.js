import {
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  updateDoc,
} from 'firebase/firestore'

import { db } from '@/firebase/config'


function getPlayerRef(roomCode, userId) {
  return doc(
    db,
    'rooms',
    roomCode,
    'players',
    userId,
  )
}


/**
 * Creates or updates a player's membership
 * in a room.
 *
 * Firebase UID is used as the player document ID.
 */
export async function addPlayer(
  roomCode,
  userId,
  {
    nickname,
    character,
    characterId,
    maxHealth,
    attributes,
    abilities,
  },
) {
  if (!roomCode) {
    throw new Error('Room code is required.')
  }

  if (!userId) {
    throw new Error('User ID is required.')
  }

  const playerRef = getPlayerRef(
    roomCode,
    userId,
  )

  const membershipRef = doc(
    db,
    'users',
    userId,
    'memberships',
    roomCode,
  )

  const batch = writeBatch(db)

  batch.set(
    playerRef,
    {
      userId,
      nickname,
      character,
      characterId,

      health: maxHealth,
      maxHealth,

      attributes,
      abilities,

      role: 'player',

      isOnline: true,
      lastSeenAt: serverTimestamp(),
      joinedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  )

  batch.set(
    membershipRef,
    {
      roomCode,
      role: 'player',
      joinedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  )

  await batch.commit()

  return {
    userId,
    roomCode,
    role: 'player',
  }
}


/**
 * Retrieve a single player.
 */
export async function getPlayer(
  roomCode,
  userId,
) {
  const playerRef = getPlayerRef(
    roomCode,
    userId,
  )

  const snapshot = await getDoc(playerRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

/**
 * Listen to ALL players in a room.
 *
 * Used by the Game Master's RoomPage.
 */
export function subscribeToPlayers(
  roomCode,
  callback,
) {
  if (!roomCode) {
    return () => {}
  }

  const playersRef = collection(
    db,
    'rooms',
    roomCode,
    'players',
  )

  return onSnapshot(
    playersRef,
    (snapshot) => {
      const players = snapshot.docs.map(
        (playerDoc) => ({
          id: playerDoc.id,
          ...playerDoc.data(),
        }),
      )

      callback(players)
    },
    (error) => {
      console.error(
        'Players subscription error:',
        error,
      )
    },
  )
}

export function subscribeToPlayer(
  roomCode,
  userId,
  callback,
  onError,
) {
  if (!roomCode || !userId) {
    return () => {}
  }

  const playerRef = getPlayerRef(
    roomCode,
    userId,
  )

  return onSnapshot(
    playerRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      callback({
        id: snapshot.id,
        ...snapshot.data(),
      })
    },
    (error) => {
      console.error(
        'Player subscription error:',
        error,
      )

      if (onError) {
        onError(error)
      }
    },
  )
}



/**
 * Applies a relative health change to a player.
 *
 * Example:
 * amount = -5 → health decreases by 5
 * amount = +2 → health increases by 2
 */
export async function applyPlayerHealthChange(
  roomCode,
  userId,
  amount,
) {
  if (!roomCode || !userId) {
    throw new Error(
      'Room code and user ID are required.',
    )
  }

  const playerRef = getPlayerRef(
    roomCode,
    userId,
  )

  await updateDoc(
    playerRef,
    {
      health: increment(amount),
      lastSeenAt: serverTimestamp(),
    },
  )
}