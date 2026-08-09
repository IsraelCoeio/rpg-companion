import { create } from 'zustand'


const useGameStore = create((set) => ({

  roomCode: null,
  nickname: '',
  isMaster: false,

  character: null,

  playerId: null,


  setRoom: ({
    roomCode,
    nickname,
    isMaster = false
  }) =>
    set({
      roomCode,
      nickname,
      isMaster,
    }),


  setCharacter: (character) =>
    set({
      character,
    }),


  setPlayerId: (playerId) =>
    set({
      playerId,
    }),


  resetGame: () =>
    set({

      roomCode: null,
      nickname: '',
      isMaster: false,

      character: null,

      playerId: null,

    }),

}))


export default useGameStore