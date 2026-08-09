import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from '@/firebase/config'

function getMembershipRef(
  userId,
  roomCode,
) {
  return doc(
    db,
    'users',
    userId,
    'memberships',
    roomCode,
  )
}

export async function addMembership(
  userId,
  roomCode,
  role,
) {
  if (!userId) {
    throw new Error(
      'User ID is required.',
    )
  }

  if (!roomCode) {
    throw new Error(
      'Room code is required.',
    )
  }

  if (!role) {
    throw new Error(
      'Membership role is required.',
    )
  }

  const membershipRef =
    getMembershipRef(
      userId,
      roomCode,
    )

  await setDoc(
    membershipRef,
    {
      roomCode,
      role,
      joinedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  )

  return {
    userId,
    roomCode,
    role,
  }
}

export async function getUserMemberships(
  userId,
) {
  if (!userId) {
    return []
  }

  const membershipsRef =
    collection(
      db,
      'users',
      userId,
      'memberships',
    )

  const snapshot =
    await getDocs(
      membershipsRef,
    )

  return snapshot.docs.map(
    (membershipDoc) => ({
      id: membershipDoc.id,
      ...membershipDoc.data(),
    }),
  )
}