import { useState } from 'react'
import { Navigate ,Link, useNavigate } from 'react-router-dom'
import { roomExists } from '@/services/roomsService'

import useGameStore from '@/store/useGameStore'
import { useUser } from '@/hooks/useUser'

import PageContainer from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'

function LobbyPage() {
  const setRoom = useGameStore((state) => state.setRoom)

  const navigate = useNavigate()

  const {
    user,
    memberships,
    profile,
    loading,
  } = useUser()

  
  const [roomCode, setRoomCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleJoinRoom(event) {
    
    event.preventDefault()
    
    const normalizedRoomCode = roomCode
      .trim()
      .toUpperCase()

    if (!normalizedRoomCode) {
      setErrorMessage('Room code is required.')
      return
    }

    setIsJoining(true)
    setErrorMessage('')

    try {
      const exists = await roomExists(normalizedRoomCode)

      if (!exists) {
        setErrorMessage('This room does not exist.')
        return
      }

      setRoom({
        roomCode: normalizedRoomCode,
        nickname: profile?.username ?? 'Player',
        userId: user.uid,
        isMaster: false,
      })

      navigate('/characters')
    } catch (error) {
      console.error('Failed to join room:', error)

      setErrorMessage(
        error.message || 'Failed to join room.',
      )
    } finally {
      setIsJoining(false)
    }
  }

  if ( loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </PageContainer>
    )
  }

  if (memberships.length > 0) {
    return (
      <Navigate
        to={`/room/${memberships[0].roomCode}`}
        replace
      />
    )
  }


  return (
    <PageContainer>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">

        {/* Header */}

        <div className="space-y-2 text-center">
          <h1 className="font-display text-4xl">
            Dados & Discípulos
          </h1>

          <p className="text-muted-foreground">
            Bem-vindo,{' '}
            <span className="font-medium text-foreground">
              {profile?.username ?? 'Adventurer'}
            </span>
            !
          </p>
        </div>

        {/* Current status */}

        <div className=" p-6 text-center shadow-lg">
          <p className="font-display text-xl">
            Você não está em nenhuma sala no momento.
          </p>

          <p className="mt-2 text-sm ">
            Entre em uma sala ou crie uma nova para começar.
          </p>
        </div>

        {/* Join Room */}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">

          <h2 className="mb-5 text-center font-display text-2xl">
            Entrar em uma Sala
          </h2>

          <form
            onSubmit={handleJoinRoom}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="room-code"
                className="pl-4 text-sm font-medium text-muted-foreground"
              >
                Código da Sala
              </label>

              <input
                id="room-code"
                value={roomCode}
                onChange={(event) => {
                  setRoomCode(
                    event.target.value.toUpperCase(),
                  )

                  setErrorMessage('')
                }}
                placeholder="Ex.: ABC123"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isJoining}
            >
              {isJoining ? 'Entrando...' : 'Entrar na Sala'}
            </Button>
          </form>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Divider */}

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-sm text-muted-foreground">
            OU
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Create Room */}

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-lg">

          <h2 className="font-display text-xl">
            Seja o narrador
          </h2>

          <p className="mb-6 mt-2 text-sm text-muted-foreground">
            Crie uma sala e convide seus amigos para jogar.
          </p>

          <Button
            asChild
            variant="secondary"
            className="w-full"
          >
            <Link to="/create-room">
              Criar uma Sala
            </Link>
          </Button>

        </div>

      </div>
    </PageContainer>
  )
}

export default LobbyPage