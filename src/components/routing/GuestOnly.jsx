import { Navigate, Outlet } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import { useAuth } from '@/hooks/useAuth'

function GuestOnly() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">
            Loading page...
          </p>
        </div>
      </PageContainer>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default GuestOnly