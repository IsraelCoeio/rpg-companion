import { X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import PlayerHealth from './PlayerHealth'

function PlayerCard({
  player,
  pendingChange,
  onChangeHealth,
  onApply,
  onDiscard,
  isEditingHealth,
  onStartEditing,
  onStopEditing,
}) {

  const health = player.health ?? 0
  const maxHealth = player.maxHealth ?? 0
  const pendingHealth = pendingChange?.health ?? 0

  const previewHealth = Math.min(
    maxHealth,
    Math.max(0, health + pendingHealth),
  )

  const hasPendingChanges = pendingHealth !== 0

  const handleDiscard = () => {
    onDiscard(player.id)
    onStopEditing(player.id)
  }

  const handleApply = () => {
    onApply(player.id)
    onStopEditing(player.id)
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight">
            {player.nickname}
          </p>

          <p className="text-sm text-muted-foreground">
            {player.character}
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {hasPendingChanges && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                pendingHealth < 0
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-green-500/10 text-green-500'
              }`}
            >
              {pendingHealth > 0
                ? `+${pendingHealth} HP`
                : `${pendingHealth} HP`}
            </span>
          )}

          {isEditingHealth && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full p-0 text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={handleDiscard}
              aria-label={`Discard changes for ${player.nickname}`}
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Health */}
      <PlayerHealth
        health={health}
        maxHealth={maxHealth}
        previewHealth={previewHealth}
        pendingHealth={pendingHealth}
        isEditing={isEditingHealth}
        playerId={player.id}
        onChangeHealth={onChangeHealth}
        onToggle={onStartEditing}
      />

      {/* Commit */}
      {isEditingHealth && (
  <Button
    variant="ghost"
    className="mt-4 w-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary disabled:border-muted disabled:bg-muted/30 disabled:text-muted-foreground"
    onClick={handleApply}
    disabled={!hasPendingChanges}
  >
    ✓ Commit
  </Button>
)}
    </div>
  )
}

export default PlayerCard