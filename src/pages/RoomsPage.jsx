import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

function RoomsPage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Rooms"
        title="Room Lobby Screen"
        description="This is the room listing shell. Business actions are intentionally not implemented in Sprint 1."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/room/TEST123">Open Room View</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/home">Back to Home</Link>
          </Button>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default RoomsPage
