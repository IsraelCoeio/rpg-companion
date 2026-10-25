import { useState } from 'react'
import { Link } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

function HomePage() {
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')

  function handleJoinRoom(event) {
    event.preventDefault()

    // We'll implement this in the next task.
    console.log({
      roomCode,
      nickname,
    })
  }

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Dados & Discípulos"
        title="Entrar em uma Sala Existente"
        description="Digite o código da sala fornecido pelo Narrador."
      >
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="room-code" className="text-sm font-medium">
              Código da Sala
            </label>

            <input
              id="room-code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              placeholder="Nome da Sala"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              Apelido
            </label>

            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Seu nome"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar na Sala
          </Button>
        </form>

        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Você é o Narrador?
          </p>

          <Button asChild variant="secondary" className="w-full">
            <Link to="/create-room">
              Criar uma Sala
            </Link>
          </Button>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default HomePage