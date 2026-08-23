import { useEffect, useState } from 'react'
import {
  Navigate,
  Outlet,
  useParams,
} from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import {
  getMembership,
} from '@/services/membershipsService'

import PageContainer from '@/components/layout/PageContainer'


function RequireMembership() {
  const { user } = useAuth()
  const { roomId } = useParams()

  const [membership, setMembership] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState('')


  useEffect(() => {
    if (!user || !roomId) {
      return
    }

    let isMounted = true

    async function loadMembership() {
      try {
        setLoading(true)
        setErrorMessage('')

        const fetchedMembership =
          await getMembership(
            user.uid,
            roomId,
          )

        if (!isMounted) {
          return
        }

        setMembership(fetchedMembership)
      } catch (error) {
        console.error(
          'Failed to load room membership:',
          error,
        )

        if (isMounted) {
          setErrorMessage(
            'Could not verify your room membership.',
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
  }, [user, roomId])


  if (loading) {
    return (
      <PageContainer>
        Loading room...
      </PageContainer>
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
    <Outlet
      context={{
        membership,
      }}
    />
  )
}


export default RequireMembership