import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import { auth } from '@/firebase/config'
import { createUserProfile } from '@/services/usersService'

const INTERNAL_EMAIL_DOMAIN = '@rpgcompanion.local'

function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}${INTERNAL_EMAIL_DOMAIN}`
}

export async function registerUser({ username, password }) {
  const normalizedUsername = username.trim()

  if (!normalizedUsername) {
    throw new Error('Username is required.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  const email = usernameToEmail(normalizedUsername)

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )

  const user = credential.user

  await createUserProfile({
    uid: user.uid,
    username: normalizedUsername,
  })

  return user
}

export async function loginUser({ username, password }) {
  const normalizedUsername = username.trim()

  if (!normalizedUsername) {
    throw new Error('Username is required.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  const email = usernameToEmail(normalizedUsername)

  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  )

  return credential.user
}

export async function logoutUser() {
  await signOut(auth)
}