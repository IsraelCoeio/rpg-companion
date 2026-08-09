import { NavLink } from 'react-router-dom'
import {
  Compass,
  ImageIcon,
} from 'lucide-react'

import { cn } from '@/utils/cn'
import useGameStore from '@/store/useGameStore'


function BottomNavigation() {

  const roomCode = useGameStore(
    (state) => state.roomCode
  )

  const isMaster = useGameStore(
    (state) => state.isMaster
  )

  const navigationItems = isMaster

    ? [
        {
          label: 'Home',
          path: `/room/${roomCode}`,
          icon: Compass,
        },
        {
          label: 'Gallery',
          path: '/gallery',
          icon: ImageIcon,
        },
      ]

    : [
        {
          label: 'Home',
          path: `/room/${roomCode}`,
          icon: Compass,
        }
      ]




  return (

    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">

      <div className="grid grid-cols-2 gap-2 p-3">


        {
          navigationItems.map(
            ({
              label,
              path,
              icon: Icon
            }) => (

              <NavLink

                key={label}

                to={path}

                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition-colors',

                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }

              >

                <Icon size={18} />

                <span>
                  {label}
                </span>


              </NavLink>

            )
          )
        }


      </div>

    </nav>

  )
}


export default BottomNavigation