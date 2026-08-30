function PlayerIdentity({
  player,
  pendingHealth,
  hasPendingChanges,
  isEditingHealth,
}) {
  return (
    <div className="pr-8">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {player.character}
      </p>

      <p className="font-display text-lg">
        {player.nickname}
      </p>

      {isEditingHealth && hasPendingChanges && (
        <span
          className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
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
    </div>
  )
}

export default PlayerIdentity