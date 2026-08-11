function AttributesGrid({ attributes }) {

    return (
        <div className="rounded-xl border border-border bg-secondary/40 p-4">

        <h2 className="font-display text-xl mb-3">
            Attributes
        </h2>

        <div className="grid grid-cols-2 gap-3">

            {Object.entries(
                attributes ?? {}
            ).map(([name, value]) => (

            <div
                key={name}
                className="rounded-lg border border-border p-3"
            >

                <p className="text-sm text-muted-foreground capitalize">
                {name}
                </p>

                <p className="text-xl font-display">
                {value}
                </p>

            </div>

            ))}

        </div>

        </div>
    )
}

export default AttributesGrid