const CHARACTERS_DATA_PATH = '/data/characters.json'

export async function getCharacters() {
  const response = await fetch(CHARACTERS_DATA_PATH)

  if (!response.ok) {
    throw new Error('Unable to load character templates.')
  }

  return response.json()
}

export async function getCharacterById(characterId) {
  const characters = await getCharacters()
  return characters.find((character) => character.id === characterId) ?? null
}
