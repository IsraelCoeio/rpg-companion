import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

function RoomsPage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Salas"
        title="Tela de Lobby da Sala"
        description="Esta é a estrutura de listagem de salas. Ações comerciais não são implementadas intencionalmente na Sprint 1."
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
