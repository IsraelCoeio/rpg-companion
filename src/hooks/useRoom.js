import { useMemo, useState } from 'react'

const baseRoom = Object.freeze({
  id: '',
  info: {
    roomName: '',
    createdAt: null,
    status: 'open',
    masterPin: '',
    presentation: null,
  },
  players: [],
  gallery: [],
})

export function useRoom(initialRoom = baseRoom) {
  const [room, setRoom] = useState(initialRoom)

  const helpers = useMemo(
    () => ({
      resetRoom: () => setRoom(baseRoom),
      updateRoomMeta: ({ id, roomName, masterPin, status, presentation }) => {
        setRoom((previous) => ({
          ...previous,
          id: id ?? previous.id,
          info: {
            ...previous.info,
            roomName: roomName ?? previous.info.roomName,
            masterPin: masterPin ?? previous.info.masterPin,
            status: status ?? previous.info.status,
            presentation: presentation ?? previous.info.presentation,
          },
        }))
      },
      setPlayers: (players) => {
        setRoom((previous) => ({ ...previous, players }))
      },
      setGallery: (gallery) => {
        setRoom((previous) => ({ ...previous, gallery }))
      },
    }),
    [],
  )

  return { room, setRoom, ...helpers }
}
