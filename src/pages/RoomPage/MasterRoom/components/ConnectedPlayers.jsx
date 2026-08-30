import PlayerCard from './PlayerCard/PlayerCard'

function ConnectedPlayers({
  players,
  pendingChanges,
  pendingPlayerCount,
  onChangeHealth,
  onApply,
  onDiscard,
  editingPlayerIds,
  onStartEditing,
  onStopEditing,
}) {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-border p-4">
      <p className="mb-4 text-sm text-muted-foreground">
        Connected players
      </p>

      {players.length === 0 ? (
        <p className="text-muted-foreground">
          No players connected yet.
        </p>
      ) : (
        <div
          className={
            pendingPlayerCount >= 2
              ? 'space-y-4 pb-24'
              : 'space-y-4'
          }
        >
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              pendingChange={pendingChanges[player.id]}
              onChangeHealth={onChangeHealth}
              onApply={onApply}
              onDiscard={onDiscard}
              isEditingHealth={editingPlayerIds.has(
                player.id,
              )}
              onStartEditing={() =>
                onStartEditing(player.id)
              }
              onStopEditing={() =>
                onStopEditing(player.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ConnectedPlayers