import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'
import useGameStore from '@/store/useGameStore'

function InventoryPage() {
  const roomCode = useGameStore((state) => state.roomCode)
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Inventory"
        title="Player Inventory Screen"
        description="Inventory surface is in place and routed. Item management logic is intentionally deferred."
      >
        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link to={`/room/${roomCode}`}>Return to Room</Link>
          </Button>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default InventoryPage
