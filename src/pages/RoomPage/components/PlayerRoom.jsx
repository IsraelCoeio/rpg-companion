import { useEffect, useState } from 'react'

import { useUser } from '@/hooks/useUser'
import PageContainer from '@/components/layout/PageContainer'

import { subscribeToPlayer } from '@/services/playersService'

import CharacterCard from './CharacterCard'
import AttributesGrid from './AttributesGrid'
import AbilitiesList from './AbilitiesList'

function PlayerRoom({ roomId }) {
  const {
    user,
    loading: userLoading,
  } = useUser()

  const [playerData, setPlayerData] =
    useState(null)

  const [errorMessage, setErrorMessage] =
    useState('')

  useEffect(() => {
    if (
      userLoading ||
      !user ||
      !roomId
    ) {
      return
    }

    const unsubscribe =
      subscribeToPlayer(
        roomId,
        user.uid,

        (player) => {
          setPlayerData(player)
        },

        (error) => {
          console.error(
            'Player subscription error:',
            error,
          )

          setErrorMessage(
            'Could not load your character.',
          )
        },
      )

    return () => unsubscribe()
  }, [
    roomId,
    user,
    userLoading,
  ])

  if (userLoading) {
    return (
      <PageContainer>
        Loading account...
      </PageContainer>
    )
  }

  if (errorMessage) {
    return (
      <PageContainer>
        {errorMessage}
      </PageContainer>
    )
  }

  if (!playerData) {
    return (
      <PageContainer>
        Loading character...
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <CharacterCard
        playerData={playerData}
      />

      <AttributesGrid
        attributes={playerData.attributes}
      />

      <AbilitiesList
        abilities={playerData.abilities}
      />
    </PageContainer>
  )
}

export default PlayerRoom