import { useMemo, useState } from 'react'

const basePlayer = Object.freeze({
  id: '',
  nickname: '',
  characterId: '',
  hp: 0,
  inventory: [],
})

export function usePlayer(initialPlayer = basePlayer) {
  const [player, setPlayer] = useState(initialPlayer)

  const helpers = useMemo(
    () => ({
      resetPlayer: () => setPlayer(basePlayer),
      updatePlayer: (patch) => {
        setPlayer((previous) => ({ ...previous, ...patch }))
      },
    }),
    [],
  )

  return { player, setPlayer, ...helpers }
}
