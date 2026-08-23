import {
  useParams,useOutletContext
} from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'

import PlayerRoom from './components/PlayerRoom'
import MasterRoom from './components/MasterRoom'

function RoomPage() {
  const { roomId } = useParams()

  const { membership } = useOutletContext()

  // User is the master.
  if (membership.role === 'master') {
    return <MasterRoom roomId={roomId} />
  }

  // User is a player.
  if (membership.role === 'player') {
    return <PlayerRoom roomId={roomId} />
  }

  // Unknown role.
  return (
    <PageContainer>
      Invalid room membership.
    </PageContainer>
  )
}

export default RoomPage