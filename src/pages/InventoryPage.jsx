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
        eyebrow="Inventário"
        title="Tela de Inventário do Jogador"
        description="A superfície do inventário está em posição e roteada. A lógica de gerenciamento de itens é intencionalmente adiada."
      >
        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link to={`/room/${roomCode}`}>Voltar à Sala</Link>
          </Button>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default InventoryPage
