import {
  doc,
  getDoc,
  serverTimestamp,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'

import { db } from '@/firebase/config'


export async function roomExists(roomCode) {
  const normalizedRoomCode =
    roomCode.trim().toUpperCase()

  const roomRef = doc(
    db,
    'rooms',
    normalizedRoomCode,
  )

  const snapshot = await getDoc(roomRef)

  return snapshot.exists()
}


export async function createRoom({
  roomCode,
  name,
  subtitle = '',
  masterId,
}) {
  const normalizedRoomCode =
    roomCode.trim().toUpperCase()

  const roomRef = doc(
    db,
    'rooms',
    normalizedRoomCode,
  )

  const membershipRef = doc(
    db,
    'users',
    masterId,
    'memberships',
    normalizedRoomCode,
  )

  await runTransaction(db, async (transaction) => {
    const roomSnapshot = await transaction.get(roomRef)
    const membershipSnapshot =
      await transaction.get(membershipRef)

    if (
      roomSnapshot.exists() ||
      membershipSnapshot.exists()
    ) {
      throw new Error('ROOM_CODE_TAKEN')
    }

    transaction.set(roomRef, {
      roomCode: normalizedRoomCode,
      name: name.trim(),
      subtitle: subtitle.trim(),
      masterId,
      createdAt: serverTimestamp(),
    })

    transaction.set(membershipRef, {
      roomCode: normalizedRoomCode,
      role: 'master',
      joinedAt: serverTimestamp(),
    })
  })

  return {
    roomCode: normalizedRoomCode,
    masterId,
  }
}


export async function joinRoom({
  roomCode,
  userId,
}) {
  const normalizedRoomCode =
    roomCode.trim().toUpperCase()

  return {
    roomCode: normalizedRoomCode,
    userId,
  }
}


export async function getRoomDetails(roomCode) {
  const roomRef = doc(db, 'rooms', roomCode)
  const snapshot = await getDoc(roomRef)

  if (!snapshot.exists()) {
    throw new Error('Room not found.')
  }

  const room = snapshot.data()

  return {
    name: room.name ?? '',
    subtitle: room.subtitle ?? '',
  }
}

export async function updateRoomDetails({
  roomCode,
  name,
  subtitle,
}) {
  const roomRef = doc(db, 'rooms', roomCode)

  await updateDoc(roomRef, {
    name: name.trim(),
    subtitle: subtitle.trim(),
  })
}
