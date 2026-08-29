function RoomInfo({ roomId }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <p className="text-sm text-muted-foreground">
        Room Code
      </p>

      <p className="font-display text-2xl tracking-widest">
        {roomId}
      </p>
    </div>
  )
}

export default RoomInfo