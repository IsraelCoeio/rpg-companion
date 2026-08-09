import { Link } from 'react-router-dom'
import { Crown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'

function MobileHeader() {
  const currentTitle = useUIStore((state) => state.currentTitle)

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/70 text-primary shadow-lg shadow-black/25">
            <Crown size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Dados & Discípulos
            </p>
            <h1 className="font-display text-xl leading-tight tracking-wide">{currentTitle}</h1>
          </div>
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link to="/settings" aria-label="Open settings">
            <Settings size={18} />
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default MobileHeader
