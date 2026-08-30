import { PencilSimple } from '@phosphor-icons/react'

function PlayerHealth({
  health,
  maxHealth,
  previewHealth,
  pendingHealth,
  isEditing,
  playerId,
  onChangeHealth,
  onToggle,
}) {
  const healthPercentage =
    maxHealth > 0
      ? (previewHealth / maxHealth) * 100
      : 0

  const handleHealthClick = (event) => {
    // Normal mode: enter edit mode.
    if (!isEditing) {
      onToggle()
      return
    }

    // Edit mode:
    // left half = -1
    // right half = +1
    const rect =
      event.currentTarget.getBoundingClientRect()

    const x = event.clientX - rect.left

    const change =
      x < rect.width / 2 ? -1 : 1

    onChangeHealth(playerId, change)
  }

  const healthValueClass =
    pendingHealth < 0
      ? 'text-red-500'
      : pendingHealth > 0
        ? 'text-green-500'
        : ''

  return (
    <div className="mt-3">
      <div
        data-health-controls
        className={
          isEditing
            ? 'cursor-pointer select-none rounded-xl bg-gradient-to-r from-secondary/60 via-secondary/0 to-secondary/60'
            : 'cursor-pointer select-none rounded-xl bg-gradient-to-r from-secondary/0 to-secondary/60'
        }
        onClick={handleHealthClick}
      >
        {isEditing ? (
          <div className="p-4">
            <div className="relative flex items-center justify-center">
              {/* Decrease */}
              <span className="absolute left-0 text-lg text-muted-foreground">
                −
              </span>

              {/* Health status */}
              <span className="flex min-w-0 items-baseline gap-1">
                {health !== previewHealth && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {health} →
                  </span>
                )}

                <span
                  className={`text-xl font-semibold ${healthValueClass}`}
                >
                  {previewHealth}
                </span>

                <span className="text-sm font-normal text-muted-foreground/60">
                  / {maxHealth}
                </span>
              </span>

              {/* Increase */}
              <span className="absolute right-0 text-lg text-muted-foreground">
                +
              </span>
            </div>

            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${healthPercentage}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            {/* Health content */}
            <div className="min-w-0 flex-1 p-4">
              {/* Label + stats */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  Health
                </span>

                <span className="flex items-baseline gap-1">
                  <span
                    className={`text-xl font-semibold ${healthValueClass}`}
                  >
                    {previewHealth}
                  </span>

                  <span className="text-sm font-normal text-muted-foreground/60">
                    / {maxHealth}
                  </span>
                </span>
              </div>

              {/* Health bar */}
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{
                    width: `${healthPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Edit button */}
            <button
              type="button"
              className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0 text-muted-foreground hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation()
                onToggle()
              }}
              aria-label="Edit health"
            >
              <PencilSimple size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerHealth