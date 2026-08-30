import { useEffect, useRef, useState } from 'react'
import { PaperPlane } from '@phosphor-icons/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

function PlayerPendingChanges({
  player,
  pendingHealth,
  onApply,
  onDiscard,
}) {
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] =
    useState(false)

  const longPressTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
      }
    }
  }, [])

  const pendingLabel =
    pendingHealth > 0
      ? `+${pendingHealth} HP`
      : `${pendingHealth} HP`

  const pendingColor =
    pendingHealth < 0
      ? 'text-red-500 bg-red-500/10'
      : 'text-green-500 bg-green-500/10'

  const startLongPress = () => {
    longPressTimeoutRef.current = setTimeout(() => {
      setIsDiscardDialogOpen(true)
    }, 500)
  }

  const cancelLongPress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${pendingColor}`}
          onPointerDown={startLongPress}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onPointerCancel={cancelLongPress}
        >
          {pendingLabel}
        </span>

        <Button
  variant="ghost"
  className="h-7 shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 text-primary hover:bg-primary/20"
  onClick={() => onApply(player.id)}
  aria-label={`Apply changes to ${player.nickname}`}
>
  <PaperPlane
    size={16}
    weight="fill"
  />
</Button>
      </div>

      <AlertDialog
        open={isDiscardDialogOpen}
        onOpenChange={setIsDiscardDialogOpen}
      >
        <AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>
      Discard changes?
    </AlertDialogTitle>

    <AlertDialogDescription asChild>
      <div className="space-y-3">
        <p>
          This will remove the pending change for{' '}
          <span className="font-semibold text-foreground">
            {player.nickname}
          </span>
          .
        </p>

        <span
          className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${pendingColor}`}
        >
          {pendingLabel}
        </span>
      </div>
    </AlertDialogDescription>
  </AlertDialogHeader>

  <AlertDialogFooter>
    <AlertDialogCancel>
      Cancel
    </AlertDialogCancel>

    <AlertDialogAction
      className="bg-red-500 text-white hover:bg-red-600"
      onClick={() => onDiscard(player.id)}
    >
      Discard
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PlayerPendingChanges