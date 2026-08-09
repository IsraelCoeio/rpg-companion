import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
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

  await setDoc(roomRef, {
    roomCode: normalizedRoomCode,
    masterId,
    createdAt: serverTimestamp(),
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

  const roomRef = doc(
    db,
    'rooms',
    normalizedRoomCode,
  )

  const roomSnapshot = await getDoc(roomRef)

  if (!roomSnapshot.exists()) {
    throw new Error('Room does not exist.')
  }

  const roomData = roomSnapshot.data()

  return {
    roomCode: normalizedRoomCode,
    masterId: roomData.masterId,
    userId,
  }
}