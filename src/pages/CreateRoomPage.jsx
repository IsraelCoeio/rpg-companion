import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addMembership } from '@/services/membershipsService'

import useGameStore from '@/store/useGameStore'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

import {
  createRoom,
  roomExists,
} from '@/services/roomsService'


function CreateRoomPage() {
  const { user } = useAuth()

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
      setErrorMessage('You must be logged in.')
      return
    }

    const normalizedRoomCode = roomCode
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '-')
      .replace(/[^A-Z0-9-]/g, '')

    if (!normalizedRoomCode) {
      setErrorMessage('Room code is required.')
      return
    }

    setIsCreating(true)
    setErrorMessage('')

    try {
      const exists = await roomExists(
        normalizedRoomCode,
      )

      if (exists) {
        setErrorMessage(
          'This room code already exists.',
        )
        return
      }

      const createdRoom = await createRoom({
        roomCode: normalizedRoomCode,
        masterId: user.uid,
      })
      
      await addMembership(
        user.uid,
        createdRoom.roomCode,
        'master',
      )

      setRoom({
        roomCode: createdRoom.roomCode,
        nickname: 'Game Master',
        isMaster: true,
      })

      navigate(`/room/${roomCode}`)
    } catch (error) {
      console.error(error)
      setErrorMessage(
        'Failed to create room.',
      )
    } finally {
      setIsCreating(false)
    }
  }


  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Create Room"
        title="Create a Room"
        description="Choose a code for your adventure."
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
              Room Code
            </label>

            <input
              id="room-code"
              value={roomCode}
              onChange={(event) =>
                setRoomCode(
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="HALLELUYA"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreating}
          >
            {isCreating
              ? 'Creating...'
              : 'Create Room'}
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