export function getLoginDestination(
  memberships,
) {

  const userMembership = memberships[0]

  if (userMembership) {
    return {
      path: `/room/${userMembership.roomCode}`,
      membership: userMembership,
    }
  }

  return '/'
}