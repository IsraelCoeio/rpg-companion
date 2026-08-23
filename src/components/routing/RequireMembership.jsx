import {
  Navigate,
  Outlet,
  useParams,
} from 'react-router-dom'

import { useUser } from '@/hooks/useUser'

import PageContainer from '@/components/layout/PageContainer'


function RequireMembership() {
  const { roomId } = useParams()

  const {
    memberships,
    loading,
  } = useUser()

  if (loading) {
    return (
      <PageContainer>
        Loading room...
      </PageContainer>
    )
  }

  const membership =
    memberships.find(
      (item) => item.roomCode === roomId,
    )

  if (!membership) {
    return (
      <Navigate
        to="/Lobby"
        replace
      />
    )
  }

  return (
    <Outlet
      context={{
        membership,
      }}
    />
  )
}


export default RequireMembership