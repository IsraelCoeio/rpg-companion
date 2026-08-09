import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '@/firebase/config'

function getUserRef(uid) {
  return doc(db, 'users', uid)
}

export async function createUserProfile({ uid, username }) {
  if (!uid) {
    throw new Error('User ID is required.')
  }

  if (!username) {
    throw new Error('Username is required.')
  }

  const userRef = getUserRef(uid)

  const userProfile = {
    uid,
    username: username.trim(),
    createdAt: serverTimestamp(),
  }

  await setDoc(userRef, userProfile)

  return userProfile
}

export async function getUserProfile(uid) {
  if (!uid) {
    throw new Error('User ID is required.')
  }

  const userRef = getUserRef(uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}