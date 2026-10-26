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
  isManagingPlayers,
selectedPlayerIds,
onTogglePlayerSelection,
}) {
  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-muted-foreground">
        Lista de jogadores:
      </p>

      <div
        className={
          pendingPlayerCount >= 2
            ? 'space-y-4 pb-24'
            : 'space-y-4'
        }
      >
        {players.map((player) => (
          <PlayerCard
  // Mantenha todas as propriedades que já existem.
  player={player}
  pendingChange={pendingChanges[player.id]}
  onChangeHealth={onChangeHealth}
  onApply={onApply}
  onDiscard={onDiscard}
  isEditingHealth={editingPlayerIds.has(player.id)}
  onStartEditing={onStartEditing}
  onStopEditing={onStopEditing}
  isManagingPlayers={isManagingPlayers}
  isSelected={selectedPlayerIds.has(player.id)}
  onToggleSelection={() => onTogglePlayerSelection(player.id)}
/>
        ))}
      </div>
    </div>
  )
}

export default ConnectedPlayers