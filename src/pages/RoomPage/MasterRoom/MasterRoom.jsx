import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'

import {
  subscribeToPlayers,
} from '@/services/playersService'

import RoomInfo from './components/RoomInfo'
import ConnectedPlayers from './components/ConnectedPlayers'

function MasterRoomPage() {
  const { roomId } = useParams()

  const [players, setPlayers] = useState([])

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

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Room"
        title={`Room ${roomId}`}
        description="Share the room code with your players. They can join using the Home screen."
      >
        <RoomInfo roomId={roomId} />

        <ConnectedPlayers
          roomId={roomId}
          players={players}
        />
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default MasterRoomPage