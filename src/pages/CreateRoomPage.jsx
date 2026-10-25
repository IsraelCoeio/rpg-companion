import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import useGameStore from '@/store/useGameStore'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'


import {
  createRoom,
} from '@/services/roomsService'

function CreateRoomPage() {
  const { user, setUserMembership } = useUser()

  const setRoom = useGameStore(
    (state) => state.setRoom,
  )

  const navigate = useNavigate()

  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  async function handleCreateRoom(event) {
    event.preventDefault()

    if (!user) {
      setErrorMessage('Você deve estar logado.')
      return
    }

    const normalizedRoomCode = roomCode
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '-')
      .replace(/[^A-Z0-9-]/g, '')

    if (!normalizedRoomCode) {
      setErrorMessage('Nome da sala é obrigatório.')
      return
    }

    setIsCreating(true)
    setErrorMessage('')

    try {

      const createdRoom = await createRoom({
        roomCode: normalizedRoomCode,
        masterId: user.uid,
      })

      setUserMembership({
        roomCode: createdRoom.roomCode,
        role: 'master',
      })

      setRoom({
        roomCode: createdRoom.roomCode,
        nickname: 'Narrador',
        isMaster: true,
      })

      navigate(`/room/${createdRoom.roomCode}`)
    } catch (error) {
      console.error(error)
      setErrorMessage(
        'Falha ao criar a sala.',
      )
    } finally {
      setIsCreating(false)
    }
  }


  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Criar Sala"
        title="Criar uma Sala"
        description="Escolha um nome para sua aventura."
      >

        <form
          onSubmit={handleCreateRoom}
          className="space-y-4"
        >

          <div className="space-y-2">
            <label
              htmlFor="room-code"
              className="text-sm font-medium"
            >
              Nome da Sala
            </label>

            <input
              id="room-code"
              value={roomCode}
              onChange={(event) =>
                setRoomCode(
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="Nome da Sala"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreating}
          >
            {isCreating
              ? 'Criando...'
              : 'Criar Sala'}
          </Button>

          {errorMessage && (
            <p className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
              {errorMessage}
            </p>
          )}

        </form>

      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default CreateRoomPage