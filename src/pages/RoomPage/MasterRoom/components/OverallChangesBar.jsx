import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

function OverallChangesBar({
  players,
  pendingChanges,
  pendingPlayerCount,
  applyAll,
}) {
  const [isExpanded, setIsExpanded] =
    useState(false)

  const barRef = useRef(null)

  useEffect(() => {
    if (!isExpanded) return

    function handleOutsideClick(event) {
      if (
        barRef.current &&
        !barRef.current.contains(event.target)
      ) {
        setIsExpanded(false)
      }
    }

    function handleScroll() {
      setIsExpanded(false)
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    document.addEventListener(
      'touchstart',
      handleOutsideClick,
    )

    window.addEventListener(
      'scroll',
      handleScroll,
      true,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )

      document.removeEventListener(
        'touchstart',
        handleOutsideClick,
      )

      window.removeEventListener(
        'scroll',
        handleScroll,
        true,
      )
    }
  }, [isExpanded])

  const pendingPlayers =
    players.filter(
      (player) =>
        pendingChanges[player.id]?.health,
    )

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-12 z-50 px-4 pb-4"
    >
      <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">

        {/* Header */}

        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          onClick={() =>
            setIsExpanded(
              (current) => !current,
            )
          }
        >
          <span className="text-sm font-medium">
            {pendingPlayerCount}{' '}
            jogadores com mudanças
          </span>

          <ChevronRight
            className={
              'h-5 w-5 text-muted-foreground transition-transform duration-200 ' +
              (isExpanded ? 'rotate-90' : '')
            }
          />
        </button>

        {/* Expanded player list */}

        {isExpanded && (
          <>
            <div className="border-t border-border px-4 py-3">
              <div className="space-y-3">
                {pendingPlayers.map(
                  (player) => {
                    const amount =
                      pendingChanges[
                        player.id
                      ]?.health ?? 0

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {player.nickname}
                        </span>

                        <span
                          className={
                            'rounded-full px-2.5 py-1 text-xs font-medium ' +
                            (amount < 0
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-green-500/10 text-green-500')
                          }
                        >
                          {amount > 0
                            ? `+${amount}`
                            : amount}{' '}
                          HP
                        </span>
                      </div>
                    )
                  },
                )}
              </div>
            </div>

            {/* Expanded Apply All */}

            <div className="border-t border-border p-3">
              <Button
                className="w-full"
                onClick={applyAll}
              >
                ✓ APLICAR TUDO
              </Button>
            </div>
          </>
        )}

        {/* Collapsed Apply All */}

        {!isExpanded && (
          <div className="border-t border-border p-2">
            <Button
              className="w-full"
              onClick={applyAll}
            >
              ✓ APLICAR TUDO
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}

export default OverallChangesBar