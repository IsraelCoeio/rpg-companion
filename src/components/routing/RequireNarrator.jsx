import {
  Navigate,
  useOutletContext,
  useParams,
} from 'react-router-dom'

function RequireNarrator({ children }) {
  const { membership } = useOutletContext()
  const { roomId } = useParams()

  if (membership.role !== 'master') {
    return (
      <Navigate
        to={`/room/${roomId}`}
        replace
      />
    )
  }

  return children
}

export default RequireNarrator