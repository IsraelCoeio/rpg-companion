import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

import {
  subscribeToPlayers,
  updatePlayerHealth,
} from '@/services/playersService'

function MasterRoomPage() {
  const { roomId } = useParams()

  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToPlayers(
      roomId,
      (updatedPlayers) => {
        setPlayers(updatedPlayers)
      },
    )

    return () => unsubscribe()
  }, [roomId])

  async function changeHealth(
    player,
    amount,
  ) {
    const currentHealth =
      player.health ?? 0

    const newHealth = Math.min(
      player.maxHealth,
      Math.max(
        0,
        currentHealth + amount,
      ),
    )

    try {
      await updatePlayerHealth(
        roomId,
        player.id,
        newHealth,
      )
    } catch (error) {
      console.error(
        'Failed to update health:',
        error,
      )
    }
  }

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Room"
        title={`Room ${roomId}`}
        description="Share the room code with your players. They can join using the Home screen."
      >
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <p className="text-sm text-muted-foreground">
            Room Code
          </p>

          <p className="font-display text-2xl tracking-widest">
            {roomId}
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Connected players
          </p>

          {players.length === 0 ? (
            <p className="text-muted-foreground">
              No players connected yet.
            </p>
          ) : (
            <div className="space-y-4">
              {players.map((player) => {
                const health =
                  player.health ?? 0

                const maxHealth =
                  player.maxHealth ?? 0

                const healthPercentage =
                  maxHealth > 0
                    ? (health / maxHealth) * 100
                    : 0

                return (
                  <div
                    key={player.id}
                    className="rounded-xl border border-border bg-secondary/40 p-4"
                  >
                    <p className="font-display text-lg">
                      {player.nickname}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {player.character}
                    </p>

                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-sm">
                        <span>
                          Health
                        </span>

                        <span>
                          {health} / {maxHealth}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-red-500 transition-all"
                          style={{
                            width: `${healthPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          changeHealth(
                            player,
                            -1,
                          )
                        }
                      >
                        -1 HP
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() =>
                          changeHealth(
                            player,
                            1,
                          )
                        }
                      >
                        +1 HP
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default MasterRoomPage