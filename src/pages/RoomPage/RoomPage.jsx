import { useEffect, useState } from 'react'
import {
  useLocation,
  useParams,
} from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import PageContainer from '@/components/layout/PageContainer'

import {
  getMembership,
} from '@/services/membershipsService'

import PlayerRoom from './components/PlayerRoom'
import MasterRoom from './components/MasterRoom'

function RoomPage() {
  const { roomId } = useParams()
  const location = useLocation()

  const {
    user,
    loading: authLoading,
  } = useAuth()

  const [membership, setMembership] = useState(
    location.state?.membership ?? null,
  )

  const [membershipLoading, setMembershipLoading] =
  useState(!location.state?.membership)

  const [membershipError, setMembershipError] =
    useState('')

  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (
      membership ||
      !user ||
      !roomId
    ) {
      return
    }

    async function loadMembership() {
      try {
        const fetchedMembership =
          await getMembership(
            user.uid,
            roomId,
          )

        setMembership(fetchedMembership)
      } catch (error) {
        console.error(
          'Could not load membership:',
          error,
        )

        setErrorMessage(
          'Could not load room membership.',
        )
      }
    }

    loadMembership()
  }, [user, roomId, membership])
  useEffect(() => {
  if (membership || !user || !roomId) {
    return
  }

  async function loadMembership() {
    try {
      setMembershipLoading(true)

      const fetchedMembership =
        await getMembership(
          user.uid,
          roomId,
        )

      setMembership(fetchedMembership)
    } catch (error) {
      console.error(
        'Could not load membership:',
        error,
      )

      setMembershipError(
        'Could not verify your room membership.',
      )
    } finally {
      setMembershipLoading(false)
    }
  }

  loadMembership()
}, [user, roomId, membership])

  // Firebase is still restoring the session.
  if (authLoading) {
    return (
      <PageContainer>
        Loading account...
      </PageContainer>
    )
  }

  // Authentication finished, but there is no user.
  if (!user) {
    return (
      <PageContainer>
        You must be logged in to enter this room.
      </PageContainer>
    )
  }

  // No room ID exists in the URL.
  if (!roomId) {
    return (
      <PageContainer>
        Room not found.
      </PageContainer>
    )
  }

  // Firestore returned an error.
  if (errorMessage) {
    return (
      <PageContainer>
        {errorMessage}
      </PageContainer>
    )
  }

  if (membershipLoading) {
  return (
    <PageContainer>
      Loading room...
    </PageContainer>
  )
}

if (membershipError) {
  return (
    <PageContainer>
      {membershipError}
    </PageContainer>
  )
}

if (!membership) {
  return (
    <PageContainer>
      You are not currently enrolled in this room.
    </PageContainer>
  )
}

  // User is the master.
  if (membership.role === 'master') {
    return <MasterRoom roomId={roomId} />
  }

  // User is a player.
  if (membership.role === 'player') {
    return <PlayerRoom roomId={roomId} />
  }

  // Unknown role.
  return (
    <PageContainer>
      Invalid room membership.
    </PageContainer>
  )
}

export default RoomPage