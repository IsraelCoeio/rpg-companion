import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import {
  getUserMemberships,
} from '@/services/membershipsService'

import PageContainer from '@/components/layout/PageContainer'


function RootRedirect() {
  const {
    user,
    loading: authLoading,
  } = useAuth()

  const [membership, setMembership] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState('')


  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      setLoading(false)
      return
    }

    let isMounted = true

    async function loadMembership() {
      try {
        setLoading(true)
        setErrorMessage('')

        const memberships =
          await getUserMemberships(user.uid)

        if (!isMounted) {
          return
        }

        setMembership(
          memberships[0] ?? null,
        )
      } catch (error) {
        console.error(
          'Failed to load user memberships:',
          error,
        )

        if (isMounted) {
          setErrorMessage(
            'Could not load your room membership.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMembership()

    return () => {
      isMounted = false
    }
  }, [authLoading, user])


  if (authLoading || loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">
            Loading account...
          </p>
        </div>
      </PageContainer>
    )
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  if (errorMessage) {
    return (
      <PageContainer>
        {errorMessage}
      </PageContainer>
    )
  }


  if (!membership) {
    return (
      <Navigate
        to="/Lobby"
        replace
      />
    )
  }


  return (
    <Navigate
      to={`/room/${membership.roomCode}`}
      replace
    />
  )
}


export default RootRedirect