export function getLoginDestination(
  memberships,
) {
  const masterMembership =
    memberships.find(
      (membership) =>
        membership.role === 'master',
    )

  if (masterMembership) {
    return `/room/${masterMembership.roomCode}/master`
  }

  const playerMembership =
    memberships.find(
      (membership) =>
        membership.role === 'player',
    )

  if (playerMembership) {
    return `/room/${playerMembership.roomCode}`
  }

  return '/'
}