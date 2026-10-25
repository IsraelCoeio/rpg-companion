import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="404"
        title="Caminho não encontrado"
        description="Esta rota não existe no mapa de navegação atual."
      >
        <Button asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default NotFoundPage
