import { readFile } from 'node:fs/promises'

import {
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app'

import {
  getFirestore,
} from 'firebase-admin/firestore'

const isProd =
  process.argv.includes('--prod')

if (isProd) {
  /*
   * Explicitly disable the Firestore emulator.
   *
   * This protects production commands from
   * inheriting FIRESTORE_EMULATOR_HOST from
   * the current shell environment.
   */
  delete process.env.FIRESTORE_EMULATOR_HOST

  const credentialsPath =
    process.env.FIREBASE_ADMIN_CREDENTIALS

  if (!credentialsPath) {
    throw new Error(
      'FIREBASE_ADMIN_CREDENTIALS is not set.',
    )
  }

  const credentials =
    JSON.parse(
      await readFile(
        credentialsPath,
        'utf8',
      ),
    )

  if (!getApps().length) {
    initializeApp({
      credential: cert(credentials),
    })
  }

  console.log(
    '🔥 Firestore target: PRODUCTION',
  )
} else {
  const emulatorHost =
    '127.0.0.1:8080'

  process.env.FIRESTORE_EMULATOR_HOST =
    emulatorHost

  if (!getApps().length) {
    initializeApp({
      projectId:
        process.env.VITE_FIREBASE_PROJECT_ID ||
        'rpg-companion-9564c',
    })
  }

  console.log(
    `🔥 Firestore target: EMULATOR (${emulatorHost})`,
  )
}

export const db =
  getFirestore()

export const isProdMode =
  isProd