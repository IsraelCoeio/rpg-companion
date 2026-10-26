import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { useNavigate } from 'react-router-dom'
import { getRoomDetails } from '@/services/roomsService'
import {
  applyPlayerHealthChange,
  subscribeToPlayers,
} from '@/services/playersService'

import RoomInfo from './components/RoomInfo'
import ConnectedPlayers from './components/ConnectedPlayers'

function MasterRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

const [roomDetails, setRoomDetails] = useState({
  name: '',
  subtitle: '',
})

useEffect(() => {
  if (!roomId) return

  let cancelled = false

  async function loadRoomDetails() {
    try {
      const details = await getRoomDetails(roomId)

      if (!cancelled) {
        setRoomDetails(details)
      }
    } catch (error) {
      console.error('Failed to load room details:', error)
    }
  }

  loadRoomDetails()

  return () => {
    cancelled = true
  }
}, [roomId])

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
        'Falha ao aplicar mudança de saúde do jogador:',
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
    <ScreenPlaceholder>
      <RoomInfo
        name={roomDetails.name}
        subtitle={roomDetails.subtitle}
        onSettingsClick={() => navigate(`/room/${roomId}/settings`)}
      />

      {players.length > 0 ? (
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
      ) : (
        
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 px-5 py-6 text-center">
  <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
    <span className="h-2 w-2 rounded-full bg-emerald-400" />
    <span>Aguardando jogadores</span>
    <span className="flex items-center gap-1">
      <span className="animate-bounce [animation-delay:-0.3s]">.</span>
      <span className="animate-bounce [animation-delay:-0.15s]">.</span>
      <span className="animate-bounce">.</span>
    </span>
  </div>

  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
    Código da sala
  </p>

  <div className="mx-auto mt-3 max-w-sm rounded-lg border border-border bg-background/70 px-4 py-4">
    <p className="wrap-anywhere font-display text-2xl font-semibold tracking-[0.2em]">
      {roomId}
    </p>
  </div>

  <p className="mt-4 text-sm text-muted-foreground">
    Compartilhe este código para convidar jogadores para a mesa.
  </p>
</div>
      )}
    </ScreenPlaceholder>
  </PageContainer>
)
}

export default MasterRoomPage