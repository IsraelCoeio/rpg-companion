import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import PageContainer from '@/components/layout/PageContainer'


function RequireAuth() {
  const {
    user,
    loading,
  } = useAuth()


  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">
            Loading account...
          </p>
        </div>
      </PageContainer>
    )
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  return <Outlet />
}


export default RequireAuth