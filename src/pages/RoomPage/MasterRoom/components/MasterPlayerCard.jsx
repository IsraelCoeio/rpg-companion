import { updatePlayerHealth } from '@/services/playersService'
import { Button } from '@/components/ui/button'

function MasterPlayerCard({ roomId, player }) {
  const health = player.health ?? 0
  const maxHealth = player.maxHealth ?? 0

  const healthPercentage =
    maxHealth > 0
      ? (health / maxHealth) * 100
      : 0

  async function changeHealth(amount) {
    const newHealth = Math.min(
      maxHealth,
      Math.max(
        0,
        health + amount,
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
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
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
          onClick={() => changeHealth(-1)}
        >
          -1 HP
        </Button>

        <Button
          variant="secondary"
          onClick={() => changeHealth(1)}
        >
          +1 HP
        </Button>
      </div>
    </div>
  )
}

export default MasterPlayerCard