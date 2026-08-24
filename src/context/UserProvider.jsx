import {
  useEffect,
  useState,
} from 'react'
import { Outlet, useOutletContext} from 'react-router-dom'


import {
  addMembership,
  getUserMemberships,
} from '@/services/membershipsService'

import { getUserProfile } from '@/services/usersService'

import { UserContext } from '@/context/UserContext'

function UserProvider() {
  const { user } = useOutletContext()

  const [profile, setProfile] =
    useState(null)

  const [memberships, setMemberships] =
    useState([])

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {
    let isMounted = true

    async function loadUserData() {
      if (!user) {
        if (isMounted) {
          setProfile(null)
          setMemberships([])
          setLoading(false)
        }

        return
      }

      try {
        setLoading(true)

        const [
          fetchedProfile,
          fetchedMemberships,
        ] = await Promise.all([
          getUserProfile(user.uid),
          getUserMemberships(user.uid),
        ])

        if (!isMounted) {
          return
        }

        setProfile(fetchedProfile)
        setMemberships(fetchedMemberships)
      } catch (error) {
        console.error(
          'Failed to load user data:',
          error,
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUserData()

    return () => {
      isMounted = false
    }
  }, [user])


  async function addUserMembership({
    roomCode,
    role,
  }) {
    const membership =
      await addMembership(
        user.uid,
        roomCode,
        role,
      )

    setMemberships((current) => [
      ...current.filter(
        (item) =>
          item.roomCode !== membership.roomCode,
      ),
      membership,
    ])

    return membership
  }


  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        memberships,
        loading,
        addUserMembership,
      }}
    >
      <Outlet />
    </UserContext.Provider>
  )
}


export default UserProvider