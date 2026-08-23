import { Navigate, Outlet } from 'react-router-dom'

import useGameStore from '@/store/useGameStore'


function RequireJoinContext() {
  const roomCode = useGameStore(
    (state) => state.roomCode,
  )


  if (!roomCode) {
    return (
      <Navigate
        to="/Lobby"
        replace
      />
    )
  }


  return <Outlet />
}


export default RequireJoinContext