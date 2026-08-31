import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
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

  const batch = writeBatch(db)

  batch.set(roomRef, {
    roomCode: normalizedRoomCode,
    masterId,
    createdAt: serverTimestamp(),
  })

  batch.set(membershipRef, {
    roomCode: normalizedRoomCode,
    role: 'master',
    joinedAt: serverTimestamp(),
  })

  await batch.commit()

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