import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useGameStore from '@/store/useGameStore'
import { useAuth } from '@/hooks/useAuth'

import { getUserProfile } from '@/services/usersService'
import { joinRoom } from '@/services/roomsService'

import PageContainer from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { getUserMemberships } from '@/services/membershipsService'

function LobbyPage() {
  const setRoom = useGameStore((state) => state.setRoom)

  const navigate = useNavigate()

  const { user} = useAuth()

  const [userProfile, setUserProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const [roomCode, setRoomCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {

    let isMounted = true

    async function loadLobbyData() {
      try {
        setProfileLoading(true)

        const [
          profile,
          memberships,
        ] = await Promise.all([
          getUserProfile(user.uid),
          getUserMemberships(user.uid),
        ])

        if (!isMounted) {
          return
        }

        setUserProfile(profile)

        const membership = memberships[0]

        if (membership) {
          navigate(
            `/room/${membership.roomCode}`,
            {
              replace: true,
              state: {
                membership,
              },
            },
          )

          return
        }
      } catch (error) {
        console.error(
          'Failed to load lobby data:',
          error,
        )

        if (isMounted) {
          setErrorMessage(
            'Failed to load your profile.',
          )
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false)
        }
      }
    }

    loadLobbyData()

    return () => {
      isMounted = false
    }
  }, [user, navigate])

  async function handleJoinRoom(event) {
    event.preventDefault()

    const normalizedRoomCode = roomCode
      .trim()
      .toUpperCase()

    if (!normalizedRoomCode) {
      setErrorMessage('Room code is required.')
      return
    }

    setIsJoining(true)
    setErrorMessage('')

    try {
      await joinRoom({
        roomCode: normalizedRoomCode,
        uid: user.uid,
      })

      setRoom({
        roomCode: normalizedRoomCode,
        nickname: userProfile?.username ?? 'Player',
        userId: user.uid,
        isMaster: false,
      })

      navigate('/characters')
    } catch (error) {
      console.error('Failed to join room:', error)

      setErrorMessage(
        error.message || 'Failed to join room.',
      )
    } finally {
      setIsJoining(false)
    }
  }

  if ( profileLoading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">

        {/* Header */}

        <div className="space-y-2 text-center">
          <h1 className="font-display text-4xl">
            Dados & Discípulos
          </h1>

          <p className="text-muted-foreground">
            Welcome,{' '}
            <span className="font-medium text-foreground">
              {userProfile?.username ?? 'Adventurer'}
            </span>
            !
          </p>
        </div>

        {/* Current status */}

        <div className=" p-6 text-center shadow-lg">
          <p className="font-display text-xl">
            You're not in any tables yet.
          </p>

          <p className="mt-2 text-sm ">
            Join an adventure or create a room and invite your friends.
          </p>
        </div>

        {/* Join Room */}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">

          <h2 className="mb-5 text-center font-display text-2xl">
            Join a Room
          </h2>

          <form
            onSubmit={handleJoinRoom}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="room-code"
                className="mb-2 block text-sm font-medium"
              >
                Room Code
              </label>

              <input
                id="room-code"
                value={roomCode}
                onChange={(event) => {
                  setRoomCode(
                    event.target.value.toUpperCase(),
                  )

                  setErrorMessage('')
                }}
                placeholder="HALLELUYA"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </Button>
          </form>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Divider */}

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-sm text-muted-foreground">
            OR
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Create Room */}

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-lg">

          <h2 className="font-display text-xl">
            Game Master
          </h2>

          <p className="mb-6 mt-2 text-sm text-muted-foreground">
            Create a room and invite your players.
          </p>

          <Button
            asChild
            variant="secondary"
            className="w-full"
          >
            <Link to="/create-room">
              Create Room
            </Link>
          </Button>

        </div>

      </div>
    </PageContainer>
  )
}

export default LobbyPage