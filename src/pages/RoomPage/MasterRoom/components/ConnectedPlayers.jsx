import MasterPlayerCard from './MasterPlayerCard'

function ConnectedPlayers({ roomId, players }) {
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
        <div className="space-y-4">
          {players.map((player) => (
            <MasterPlayerCard
              key={player.id}
              roomId={roomId}
              player={player}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ConnectedPlayers