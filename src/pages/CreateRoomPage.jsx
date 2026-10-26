
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import useGameStore from '@/store/useGameStore'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

import { createRoom } from '@/services/roomsService'

const ROOM_CODE_CHARACTERS =
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRoomCode() {
  return Array.from({ length: 6 }, () => {
    const index = Math.floor(
      Math.random() * ROOM_CODE_CHARACTERS.length,
    )

    return ROOM_CODE_CHARACTERS[index]
  }).join('')
}

function CreateRoomPage() {
  const { user, setUserMembership } = useUser()

  const setRoom = useGameStore((state) => state.setRoom)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [roomCode] = useState(generateRoomCode)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleCreateRoom(event) {
    event.preventDefault()

    if (!user) {
      setErrorMessage('Você deve estar logado.')
      return
    }

    const normalizedName = name.trim()
    const normalizedSubtitle = subtitle.trim()

    if (!normalizedName) {
      setErrorMessage('O nome da sala é obrigatório.')
      return
    }

    setIsCreating(true)
    setErrorMessage('')

    try {
      const createdRoom = await createRoom({
        roomCode,
        name: normalizedName,
        subtitle: normalizedSubtitle,
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
        error.message === 'ROOM_CODE_TAKEN'
          ? 'Esse código já está em uso. Gere outro código e tente novamente.'
          : 'Não foi possível criar a sala. Tente novamente.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Criar Sala"
        title="Crie sua aventura"
        description="Dê um nome à sua sala e convide seus amigos para jogar."
      >
        <form
          onSubmit={handleCreateRoom}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="room-name"
              className="pl-4 text-sm font-medium text-muted-foreground"
            >
              Nome da sala
            </label>

            <input
              id="room-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: As Crônicas do Dragão"
              maxLength={80}
              required
              disabled={isCreating}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />

            
          </div>

          <div className="space-y-2">
            <label
              htmlFor="room-subtitle"
              className="pl-4 text-sm font-medium text-muted-foreground"
            >
              Subtítulo{' '}
              <span className="text-sm font-normal text-muted-foreground">
                (opcional)
              </span>
            </label>

            <textarea
              id="room-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Uma breve frase para dar o tom da aventura…"
              maxLength={240}
              rows={3}
              disabled={isCreating}
              className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />

            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Você pode adicionar uma descrição depois nas
                configurações da sala.
              </p>

              
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500"
            >
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isCreating}
          >
            {isCreating ? 'Criando...' : 'Criar sala'}
          </Button>
        </form>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default CreateRoomPage
