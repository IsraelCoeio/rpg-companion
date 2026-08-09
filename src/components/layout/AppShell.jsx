import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MobileHeader from '@/components/navigation/MobileHeader'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import { useUIStore } from '@/store/useUIStore'
import { routeTitles } from '@/utils/routes'

function AppShell() {
  const location = useLocation()
  const setRoute = useUIStore((state) => state.setRoute)

  useEffect(() => {
    const title = routeTitles[location.pathname] ?? 'RPGesus'
    setRoute({ path: location.pathname, title })
  }, [location.pathname, setRoute])

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(138,104,255,0.18),_transparent_38%),radial-gradient(circle_at_80%_80%,_rgba(30,132,144,0.16),_transparent_42%)]" />
      <div className="relative mx-auto flex min-h-svh w-full max-w-3xl flex-col border-x border-border/50 bg-background/70 shadow-[0_0_80px_rgba(0,0,0,0.55)]">
        <MobileHeader />
        <main className="flex-1 pb-20">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}

export default AppShell
