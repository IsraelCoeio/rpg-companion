import { useEffect, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'

import { useUser } from '@/hooks/useUser'
import { logoutUser } from '@/services/authService'

import { Button } from '@/components/ui/button'


function getInitials(username) {
  if (!username) {
    return '??'
  }

  return username
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}


function UserMenu() {
  const {
    profile,
    memberships,
  } = useUser()

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const username =
    profile?.username ?? 'Adventurer'

  const initials =
    getInitials(username)

  const membership =
    memberships[0] ?? null

  const membershipLabel =
    membership?.role === 'master'
      ? 'Narrator'
      : membership?.role === 'player'
        ? 'Player'
        : null

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    document.addEventListener(
      'touchstart',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )

      document.removeEventListener(
        'touchstart',
        handleClickOutside,
      )
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (error) {
      console.error(
        'Failed to log out:',
        error,
      )
    }
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/80 text-sm font-semibold text-secondary-foreground shadow-lg shadow-black/25">
          {initials}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/80 text-sm font-semibold">
              {initials}
            </span>

            <div className="min-w-0">
              <p className="truncate font-semibold">
                {username}
              </p>

              {membership ? (
                <p className="truncate text-xs text-muted-foreground">
                  {membershipLabel} · {membership.roomCode}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Not currently in a room
                </p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Log out
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserMenu