import {
  useEffect,
  useState,
} from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '@/firebase/config'
import { AuthContext } from './AuthContext'


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          console.log(
            'AUTH USER:',
            firebaseUser,
          )

          setUser(firebaseUser)
          setLoading(false)
        },
      )

    return unsubscribe
  }, [])


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated:
          Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}