import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="404"
        title="Path Not Found"
        description="This route does not exist in the current navigation map."
      >
        <Button asChild>
          <Link to="/home">Return to Home</Link>
        </Button>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default NotFoundPage
