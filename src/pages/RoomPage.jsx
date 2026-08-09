import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import PageContainer from '@/components/layout/PageContainer'

import { subscribeToPlayer } from '@/services/playersService'

function RoomPage() {
  const { roomId } = useParams()

  const {
    user,
    loading: authLoading,
  } = useAuth()

  const [playerData, setPlayerData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (authLoading || !user || !roomId) {
      return
    }

    const unsubscribe = subscribeToPlayer(
      roomId,
      user.uid,

      (player) => {
        setPlayerData(player)
      },

      (error) => {
        console.error(
          'Player subscription error:',
          error,
        )

        setErrorMessage(
          'Could not load your character.',
        )
      },
    )

    return () => unsubscribe()
  }, [roomId, user, authLoading])

  // Firebase is still restoring the session.
  if (authLoading) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">
          Loading account...
        </p>
      </PageContainer>
    )
  }

  // Authentication finished, but there is no user.
  if (!user) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">
          You must be logged in to enter this room.
        </p>
      </PageContainer>
    )
  }

  // No room ID exists in the URL.
  if (!roomId) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">
          Room not found.
        </p>
      </PageContainer>
    )
  }

  // Firestore returned an error.
  if (errorMessage) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-center">
          <p className="text-red-500">
            {errorMessage}
          </p>
        </div>
      </PageContainer>
    )
  }

  // Firebase is authenticated and the subscription
  // has not returned the player yet.
  if (!playerData) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">
          Loading character...
        </p>
      </PageContainer>
    )
  }

  const maxHealth = playerData.maxHealth ?? 0
  const currentHealth = playerData.health ?? 0

  const healthPercentage =
    maxHealth > 0
      ? (currentHealth / maxHealth) * 100
      : 0

  return (
    <PageContainer>
      <div className="space-y-4">

        {/* Player information */}

        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <p className="font-display text-2xl">
            {playerData.nickname}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Room: {roomId}
          </p>
        </div>


        {/* Character */}

        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <h2 className="font-display text-xl">
            {playerData.character}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Character ID: {playerData.characterId}
          </p>
        </div>


        {/* Health */}

        <div className="rounded-xl border border-border bg-secondary/40 p-4">

          <div className="mb-2 flex justify-between text-sm">
            <span>
              Health
            </span>

            <span>
              {currentHealth} / {maxHealth}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    healthPercentage,
                  ),
                )}%`,
              }}
            />
          </div>

        </div>


       {/* Attributes */}

<div className="rounded-xl border border-border bg-secondary/40 p-4">

  <h2 className="font-display text-xl mb-3">
    Attributes
  </h2>

  <div className="grid grid-cols-2 gap-3">

    {Object.entries(
      playerData?.attributes ?? {}
    ).map(([name, value]) => (

      <div
        key={name}
        className="rounded-lg border border-border p-3"
      >

        <p className="text-sm text-muted-foreground capitalize">
          {name}
        </p>

        <p className="text-xl font-display">
          {value}
        </p>

      </div>

    ))}

  </div>

</div>


        {/* Abilities */}

<div className="rounded-xl border border-border bg-secondary/40 p-4">

  <h2 className="font-display text-xl mb-3">
    Abilities
  </h2>

  <div className="space-y-2">

    {playerData?.abilities?.map((ability) => (

      <div
        key={ability.name}
        className="rounded-lg border border-border p-3"
      >

        <p className="font-medium">
          {ability.name}
        </p>

        <p className="text-sm text-muted-foreground mt-1">
          {ability.description}
        </p>

      </div>

    ))}

  </div>

</div>

      </div>
    </PageContainer>
  )
}

export default RoomPage