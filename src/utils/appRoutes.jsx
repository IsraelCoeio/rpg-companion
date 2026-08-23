import AppShell from '@/components/layout/AppShell'
import RequireAuth from '@/components/routing/RequireAuth'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import RequireJoinContext from '@/components/routing/RequireJoinContext'
import RootRedirect from '@/components/routing/RouteRedirect'

import LobbyPage from '@/pages/LobbyPage'
import CreateRoomPage from '@/pages/CreateRoomPage'

import RoomPage from '@/pages/RoomPage/RoomPage'

import CharactersPage from '@/pages/CharactersPage'
import AbilitiesPage from '@/pages/AbilitiesPage'

import InventoryPage from '@/pages/InventoryPage'
import GalleryPage from '@/pages/GalleryPage'

import ProfilePage from '@/pages/ProfilePage'

import NotFoundPage from '@/pages/NotFoundPage'

import RequireMembership from '@/components/routing/RequireMembership'



export const appRoutes = [

  // No navbar

  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/Lobby',
        element: <LobbyPage />,
      },
      {
        path: '/create-room',
        element: <CreateRoomPage />,
      },
      {
        path: '/',
        element: <AppShell />,

        children: [

          { element: <RequireJoinContext />, 
              children: [{
                path: 'characters',
                element: <CharactersPage />,
              }
            ]
          },
        ]
      },
      {
        element: <RequireMembership />,
        children: [
          {
            path: 'room/:roomId',
            element: <RoomPage />,
          },

          {
            path: 'abilities',
            element: <AbilitiesPage />,
          },


          {
            path: 'inventory',
            element: <InventoryPage />,
          },
        ]
      },

      {
        path: 'gallery',
        element: <GalleryPage />,
      },


      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ]
  },


  {
    path: '/register',
    element: <RegisterPage />,
  },


  {
    path: '/login',
    element: <LoginPage />,
  },



  {
    path: '*',
    element: <NotFoundPage />,
  },

]