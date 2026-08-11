import AppShell from '@/components/layout/AppShell'

import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'

import LobbyPage from '@/pages/LobbyPage'
import CreateRoomPage from '@/pages/CreateRoomPage'

import RoomPage from '@/pages/RoomPage/RoomPage'

import CharactersPage from '@/pages/CharactersPage'
import AbilitiesPage from '@/pages/AbilitiesPage'

import InventoryPage from '@/pages/InventoryPage'
import GalleryPage from '@/pages/GalleryPage'

import ProfilePage from '@/pages/ProfilePage'

import NotFoundPage from '@/pages/NotFoundPage'



export const appRoutes = [

  // No navbar

  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/Lobby',
    element: <LobbyPage />,
  },


  {
    path: '/create-room',
    element: <CreateRoomPage />,
  },


  {
    path: '/register',
    element: <RegisterPage />,
  },


  {
    path: '/login',
    element: <LoginPage />,
  },


  // Navbar visible

  {
    path: '/',
    element: <AppShell />,

    children: [

      {
        path: 'room/:roomId',
        element: <RoomPage />,
      },


      {
        path: 'characters',
        element: <CharactersPage />,
      },


      {
        path: 'abilities',
        element: <AbilitiesPage />,
      },


      {
        path: 'inventory',
        element: <InventoryPage />,
      },


      {
        path: 'gallery',
        element: <GalleryPage />,
      },


      {
        path: 'profile',
        element: <ProfilePage />,
      },


    ],
  },



  {
    path: '*',
    element: <NotFoundPage />,
  },

]