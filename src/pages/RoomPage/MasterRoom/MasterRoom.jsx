import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Copy, Trash, Password } from '@phosphor-icons/react'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { getRoomDetails } from '@/services/roomsService'
import {
  applyPlayerHealthChange,
  removePlayers,
  subscribeToPlayers,
} from '@/services/playersService'

import RoomInfo from './components/RoomInfo'
import ConnectedPlayers from './components/ConnectedPlayers'

function MasterRoomPage() {
  const [isRoomCodeOpen, setIsRoomCodeOpen] = useState(false)
  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const isManagingPlayers =
    location.pathname.endsWith('/players')

  const [roomDetails, setRoomDetails] = useState({
    name: '',
    subtitle: '',
  })

  const [players, setPlayers] = useState([])
  const [pendingChanges, setPendingChanges] = useState({})
  const [editingPlayerIds, setEditingPlayerIds] = useState(
    () => new Set(),
  )

  const [selectedPlayerIds, setSelectedPlayerIds] = useState(
    () => new Set(),
  )

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] =
    useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [removeError, setRemoveError] = useState('')

  async function copyRoomCode() {
    try {
      await navigator.clipboard.writeText(roomId)
    } catch (error) {
      console.error('Failed to copy room code:', error)
    }
  }

  const cancelPlayerManagement = () => {
    setSelectedPlayerIds(new Set())
    setRemoveError('')
    setIsRemoveDialogOpen(false)
    navigate(`/room/${roomId}`)
  }

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
        console.error(
          'Failed to load room details:',
          error,
        )
      }
    }

    loadRoomDetails()

    return () => {
      cancelled = true
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    return subscribeToPlayers(roomId, (updatedPlayers) => {
      setPlayers(updatedPlayers)
    })
  }, [roomId])

  function startEditing(playerId) {
    setEditingPlayerIds((current) => {
      const next = new Set(current)
      next.add(playerId)
      return next
    })
  }

  function stopEditing(playerId) {
    setEditingPlayerIds((current) => {
      const next = new Set(current)
      next.delete(playerId)
      return next
    })
  }

  function changeHealth(playerId, amount) {
    const player = players.find(
      (item) => item.id === playerId,
    )

    if (!player) return

    setPendingChanges((current) => {
      const currentPending =
        current[playerId]?.health ?? 0

      const nextPending = currentPending + amount

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

    if (amount === 0 || !roomId) return

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

      setPendingChanges((current) => ({
        ...current,
        [playerId]: {
          health: amount,
        },
      }))
    }
  }

  async function applyAll() {
    const changes = Object.entries(pendingChanges)

    if (changes.length === 0 || !roomId) return

    setEditingPlayerIds(new Set())
    setPendingChanges({})

    try {
      await Promise.all(
        changes.map(([playerId, change]) =>
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

      setPendingChanges((current) => ({
        ...Object.fromEntries(changes),
        ...current,
      }))
    }
  }

  function togglePlayerSelection(playerId) {
    setSelectedPlayerIds((current) => {
      const next = new Set(current)

      if (next.has(playerId)) {
        next.delete(playerId)
      } else {
        next.add(playerId)
      }

      return next
    })

    setRemoveError('')
  }

  async function handleRemovePlayers() {
    if (
      !roomId ||
      selectedPlayerIds.size === 0 ||
      isRemoving
    ) {
      return
    }

    setIsRemoving(true)
    setRemoveError('')

    try {
      await removePlayers(roomId, [...selectedPlayerIds])

      setSelectedPlayerIds(new Set())
      setRemoveError('')
      setIsRemoveDialogOpen(false)

      navigate(`/room/${roomId}`)
    } catch (error) {
      console.error('Failed to remove players:', error)
      setRemoveError(
        'Não foi possível remover os jogadores. Tente novamente.',
      )
    } finally {
      setIsRemoving(false)
    }
  }

  const pendingPlayerCount =
    Object.keys(pendingChanges).length

  return (
    <PageContainer>
      <ScreenPlaceholder>
        <RoomInfo
          name={roomDetails.name}
          subtitle={roomDetails.subtitle}
          onSettingsClick={() =>
            navigate(`/room/${roomId}/settings`)
          }
        />

        {players.length > 0 ? (
          <>
              
<div className="mt-4 flex justify-end">
  <Button
    type="button"
    variant="outline"
    size="sm"
    className="gap-2 text-muted-foreground"
    onClick={() => setIsRoomCodeOpen(true)}
  >
    <Password size={16} />
    Código da sala
  </Button>
</div>

{isRoomCodeOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    onClick={() => setIsRoomCodeOpen(false)}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-code-title"
      className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <h2
        id="room-code-title"
        className="text-lg font-semibold"
      >
        Código da sala
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Compartilhe este código para convidar jogadores
        para a mesa.
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-3">
        <p className="min-w-0 flex-1 break-all font-display text-xl font-semibold tracking-[0.15em]">
          {roomId}
        </p>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Copiar código da sala"
          onClick={copyRoomCode}
        >
          <Copy size={18} />
        </Button>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          type="button"
          onClick={() => setIsRoomCodeOpen(false)}
        >
          Fechar
        </Button>
      </div>
    </div>
  </div>
)}

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
              isManagingPlayers={isManagingPlayers}
              selectedPlayerIds={selectedPlayerIds}
              onTogglePlayerSelection={togglePlayerSelection}
            />
          </>
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-secondary/30 px-5 py-6 text-center">
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Aguardando jogadores</span>
              <span className="flex items-center gap-1">
                <span className="animate-bounce [animation-delay:-0.3s]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:-0.15s]">
                  .
                </span>
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

            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={copyRoomCode}
              >
                <Copy size={16} />
                Copiar código
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Compartilhe este código para convidar jogadores
              para a mesa.
            </p>
          </div>
        )}

        <AlertDialog
          open={isRemoveDialogOpen}
          onOpenChange={(open) => {
            if (!isRemoving) {
              setIsRemoveDialogOpen(open)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remover jogadores da sala?
              </AlertDialogTitle>

              <AlertDialogDescription>
                {`Você está prestes a remover ${selectedPlayerIds.size} ${
                  selectedPlayerIds.size === 1
                    ? 'jogador'
                    : 'jogadores'
                } desta sala. Essa ação não pode ser desfeita. Os personagens originais não serão apagados.`}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRemoving}>
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={
                  isRemoving ||
                  selectedPlayerIds.size === 0
                }
                onClick={(event) => {
                  event.preventDefault()
                  handleRemovePlayers()
                }}
              >
                {isRemoving
                  ? 'Removendo...'
                  : 'Confirmar remoção'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ScreenPlaceholder>

      <div className={isManagingPlayers ? 'pb-28' : ''}>
        {/* Room info and connected players */}
      </div>

      {isManagingPlayers && removeError && (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-2xl rounded-lg border border-red-500/30 bg-background px-4 py-3 text-sm text-red-500 shadow-lg"
        >
          {removeError}
        </div>
      )}

      {isManagingPlayers && (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-background/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-2xl gap-3">
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={cancelPlayerManagement}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              disabled={selectedPlayerIds.size === 0}
              onClick={() => setIsRemoveDialogOpen(true)}
            >
              <Trash size={18} className="mr-2" />
              {selectedPlayerIds.size === 0
                ? 'Remover jogadores'
                : `Remover ${selectedPlayerIds.size} ${
                    selectedPlayerIds.size === 1
                      ? 'jogador'
                      : 'jogadores'
                  }`}
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default MasterRoomPage