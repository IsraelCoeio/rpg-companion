import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

import useGameStore from '@/store/useGameStore'

import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

import { getCharacters } from '@/services/charactersService'
import { addPlayer } from '@/services/playersService'
import { useUser } from '@/hooks/useUser'


function CharactersPage() {
  const {
    addUserMembership,
  } = useUser()
  const navigate = useNavigate()

  const { user} =
    useAuth()

  const roomCode = useGameStore(
    (state) => state.roomCode,
  )

  const nickname = useGameStore(
    (state) => state.nickname,
  )

  const setCharacter = useGameStore(
    (state) => state.setCharacter,
  )

  const [characters, setCharacters] =
    useState([])

  const [selectedCharacter, setSelectedCharacter] =
    useState(null)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(false)


  useEffect(() => {
    let isMounted = true

    getCharacters()
      .then((data) => {
        if (!isMounted) return

        setCharacters(data)
        setErrorMessage('')
      })
      .catch((error) => {
        if (!isMounted) return

        setErrorMessage(
          error.message ||
          'Failed to load characters.',
        )
      })

    return () => {
      isMounted = false
    }
  }, [])


  function toggleCharacter(character) {
    if (
      selectedCharacter?.id ===
      character.id
    ) {
      setSelectedCharacter(null)
      return
    }

    setSelectedCharacter(character)
    setErrorMessage('')
  }


  async function handleReady() {
    if (!selectedCharacter) {
      return
    }

    if (!roomCode) {
      setErrorMessage(
        'No room was selected.',
      )
      return
    }

    if (!nickname) {
      setErrorMessage(
        'No nickname was provided.',
      )
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      /*
       * Store the character locally for the
       * current UI session.
       */
      setCharacter(selectedCharacter)

      /*
       * The Firebase UID is the player's identity.
       *
       * This creates or updates:
       *
       * rooms/{roomCode}/players/{user.uid}
       */
      await addPlayer(
        roomCode,
        user.uid,
        {
          nickname,
          character: selectedCharacter.name,
          characterId: selectedCharacter.id,
          maxHealth: selectedCharacter.health,
          attributes: selectedCharacter.attributes,
          abilities: selectedCharacter.abilities,
        },
      )

      await addUserMembership({
        roomCode,
        role: 'player',
      })

      /*
       * Now the player officially belongs
       * to the room.
       */
      navigate(`/room/${roomCode}`)
    } catch (error) {
      console.error(
        'Failed to join room:',
        error,
      )

      setErrorMessage(
        error?.message ||
        'Failed to join the room.',
      )
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Characters"
        title="Choose your character"
        description="Select your character for the adventure."
      >

        {errorMessage && (
          <p className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <div className="grid gap-4">
          {characters.map((character) => {
            const selected =
              selectedCharacter?.id ===
              character.id

            return (
              <button
                key={character.id}
                type="button"
                onClick={() =>
                  toggleCharacter(character)
                }
                disabled={isLoading}
                className={`
                  rounded-2xl border p-4
                  text-left transition
                  ${
                    selected
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-border hover:border-primary/50'
                  }
                  ${
                    isLoading
                      ? 'cursor-not-allowed opacity-60'
                      : ''
                  }
                `}
              >
                <h3 className="font-display text-xl">
                  {character.name}
                </h3>

                <p className="text-muted-foreground">
                  {character.title}
                </p>

                <p className="mt-2">
                  HP: {character.health}
                </p>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <Button
            disabled={
              !selectedCharacter ||
              isLoading
            }
            onClick={handleReady}
            className="w-full"
          >
            {isLoading
              ? 'Joining...'
              : 'Ready'}
          </Button>
        </div>

      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default CharactersPage