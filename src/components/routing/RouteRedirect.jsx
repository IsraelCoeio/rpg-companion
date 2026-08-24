import { Navigate } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'

import { useUser } from '@/hooks/useUser'

function RootRedirect() {
  const {
    memberships,
    loading,
  } = useUser()

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

  const membership = memberships[0]

  if (!membership) {
    return (
      <Navigate
        to="/Lobby"
        replace
      />
    )
  }

  return (
    <Navigate
      to={`/room/${membership.roomCode}`}
      replace
    />
  )
}


export default RootRedirect