function RoomInfo({ roomId, hasPlayers }) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
        Table
      </p>

      <h1 className="mt-2 font-display text-4xl font-semibold tracking-[0.2em]">
        {roomId}
      </h1>

      <p className="mt-3 text-sm text-muted-foreground">
        This is the room code.
        {hasPlayers && ' Give it to new players to join.'}
      </p>
    </div>
  )
}

export default RoomInfo
