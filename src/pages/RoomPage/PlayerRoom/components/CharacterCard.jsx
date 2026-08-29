function CharacterCard({ playerData}) {
    const maxHealth = playerData.maxHealth ?? 0
    const currentHealth = playerData.health ?? 0
    const healthPercentage =
    maxHealth > 0
      ? (currentHealth / maxHealth) * 100
      : 0
    return (
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <h2 className="font-display text-xl">
            {playerData.character}
          </h2>

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
    )
}

export default CharacterCard