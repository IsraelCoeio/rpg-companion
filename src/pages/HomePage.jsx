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
        title="Join an Existing Room"
        description="Enter the room code provided by the Game Master."
      >
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="room-code" className="text-sm font-medium">
              Room Code
            </label>

            <input
              id="room-code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              placeholder="ABC12345"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              Nickname
            </label>

            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
            />
          </div>

          <Button type="submit" className="w-full">
            Join Room
          </Button>
        </form>

        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Are you the Game Master?
          </p>

          <Button asChild variant="secondary" className="w-full">
            <Link to="/create-room">
              Create a New Room
            </Link>
          </Button>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default HomePage