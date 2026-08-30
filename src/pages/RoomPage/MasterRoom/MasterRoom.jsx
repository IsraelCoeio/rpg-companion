import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import {
  applyPlayerHealthChange,
  subscribeToPlayers,
} from '@/services/playersService'

import RoomInfo from './components/RoomInfo'
import ConnectedPlayers from './components/ConnectedPlayers'

function MasterRoomPage() {
  const [editingPlayerIds, setEditingPlayerIds] =
  useState(new Set())

  const startEditing = (playerId) => {
  setEditingPlayerIds((current) => {
    const next = new Set(current)
    next.add(playerId)
    return next
  })
}

const stopEditing = (playerId) => {
  setEditingPlayerIds((current) => {
    const next = new Set(current)
    next.delete(playerId)
    return next
  })
}
  const { roomId } = useParams()

  const [players, setPlayers] = useState([])
  const [pendingChanges, setPendingChanges] = useState({})

  function changeHealth(playerId, amount) {
    const player = players.find(
      (player) => player.id === playerId,
    )

    if (!player) return

    setPendingChanges((current) => {
      const currentPending =
        current[playerId]?.health ?? 0

      const nextPending =
        currentPending + amount

      const previewHealth = Math.min(
        player.maxHealth ?? 0,
        Math.max(
          0,
          (player.health ?? 0) + nextPending,
        ),
      )

      const clampedPending =
        previewHealth - (player.health ?? 0)

      if (clampedPending === 0) {
        const next = { ...current }
        delete next[playerId]
        return next
      }

      return {
        ...current,
        [playerId]: {
          health: clampedPending,
        },
      }
    })
  }

  function discardChanges(playerId) {
    setPendingChanges((current) => {
      const next = { ...current }

      delete next[playerId]

      return next
    })
  }

  async function applyChanges(playerId) {
    const amount =
      pendingChanges[playerId]?.health ?? 0

    if (amount === 0) return

    // Remove the pending change immediately.
    // This prevents the Firestore snapshot from
    // temporarily being combined with the old pending delta.
    setPendingChanges((current) => {
      const next = { ...current }

      delete next[playerId]

      return next
    })

    try {
      await applyPlayerHealthChange(
        roomId,
        playerId,
        amount,
      )
    } catch (error) {
      console.error(
        'Failed to apply player health change:',
        error,
      )

      // Restore the pending change if the write failed.
      setPendingChanges((current) => ({
        ...current,
        [playerId]: {
          health: amount,
        },
      }))
    }
  }

  async function applyAll() {
  const changes =
    Object.entries(pendingChanges)

  if (changes.length === 0) return

  // Exit edit mode immediately.
  setEditingPlayerIds(new Set())

  // Clear pending changes immediately.
  setPendingChanges({})

  try {
    await Promise.all(
      changes.map(
        ([playerId, change]) =>
          applyPlayerHealthChange(
            roomId,
            playerId,
            change.health,
          ),
      ),
    )
  } catch (error) {
    console.error(
      'Failed to apply all player changes:',
      error,
    )

    setPendingChanges(
      Object.fromEntries(changes),
    )
  }
}

  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToPlayers(
      roomId,
      (updatedPlayers) => {
        setPlayers(updatedPlayers)
      },
    )

    return () => unsubscribe()
  }, [roomId])

  const pendingPlayerCount =
    Object.keys(pendingChanges).length

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Room"
        title={`Room ${roomId}`}
        description="Share the room code with your players. They can join using the Home screen."
      >
        <RoomInfo roomId={roomId} />

        <ConnectedPlayers
          players={players}
          pendingChanges={pendingChanges}
          pendingPlayerCount={pendingPlayerCount}
          onChangeHealth={changeHealth}
          onApply={applyChanges}
          onApplyAll={applyAll}
          onDiscard={discardChanges}
          editingPlayerIds={editingPlayerIds}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
        />
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default MasterRoomPage