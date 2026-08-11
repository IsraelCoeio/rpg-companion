function AbilitiesList({ abilities }) {

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">

  <h2 className="font-display text-xl mb-3">
    Abilities
  </h2>

  <div className="space-y-2">

    {abilities?.map((ability) => (

      <div
        key={ability.name}
        className="rounded-lg border border-border p-3"
      >

        <p className="font-medium">
          {ability.name}
        </p>

        <p className="text-sm text-muted-foreground mt-1">
          {ability.description}
        </p>

      </div>

    ))}

  </div>

</div>
)
}

export default AbilitiesList