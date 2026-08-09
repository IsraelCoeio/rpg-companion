import { create } from 'zustand'

export const useUIStore = create((set) => ({
  currentPath: '/home',
  currentTitle: 'RPGesus',
  setRoute: ({ path, title }) => {
    set({ currentPath: path, currentTitle: title })
  },
}))
