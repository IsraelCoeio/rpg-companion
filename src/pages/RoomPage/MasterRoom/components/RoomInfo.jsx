import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

function RoomInfo({
  name,
  subtitle,
  onSettingsClick,
}) {
  return (
    <div className="relative text-center">
      <div className="relative flex items-center justify-center py-1">
  <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
    Sala
  </p>

  <Button
    variant="ghost"
    size="icon"
    className="absolute -top-4 right-0 z-10 h-12 w-12 rounded-xl text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
    onClick={onSettingsClick}
    aria-label="Configurações da sala"
    title="Configurações da sala"
  >
    <Settings2 className="h-5 w-5" />
  </Button>
</div>
      <h1 className="mt-2 wrap-anywhere font-display text-3xl font-semibold">
        {name || 'Sua aventura'}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default RoomInfo
