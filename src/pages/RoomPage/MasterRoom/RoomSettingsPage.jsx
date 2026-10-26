import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Users } from '@phosphor-icons/react'

import PageContainer from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import {
  getRoomDetails,
  updateRoomDetails,
} from '@/services/roomsService'

function RoomSettingsPage() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [initialDetails, setInitialDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadRoomDetails() {
      try {
        const details = await getRoomDetails(roomId)

        if (cancelled) return

        setName(details.name)
        setSubtitle(details.subtitle)
        setInitialDetails(details)
      } catch {
        if (!cancelled) {
          setError('Não foi possível carregar os detalhes da sala.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRoomDetails()

    return () => {
      cancelled = true
    }
  }, [roomId])

  const hasChanges =
    initialDetails !== null &&
    (name.trim() !== initialDetails.name ||
      subtitle.trim() !== initialDetails.subtitle)

  async function handleSave(event) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedSubtitle = subtitle.trim()

    if (!trimmedName) {
      setError('O nome da sala é obrigatório.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateRoomDetails({
        roomCode: roomId,
        name: trimmedName,
        subtitle: trimmedSubtitle,
      })

      setName(trimmedName)
      setSubtitle(trimmedSubtitle)
      setInitialDetails({
        name: trimmedName,
        subtitle: trimmedSubtitle,
      })
      setSuccess('Detalhes da sala salvos!')
    } catch (error) {
      console.error('Failed to update room details:', error)

      setError(
        error.code === 'permission-denied'
          ? 'Permissão negada pelo Firestore. Verifique as regras de acesso.'
          : `Não foi possível salvar: ${error.message}`
      )
    } finally {
      setSaving(false)
    }
  }

  return (
  <PageContainer>
    <div className="mx-auto w-full max-w-2xl py-6">
      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center gap-2 px-12 py-1">
          <p className="min-w-0 text-center text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Configurações da sala
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-0 z-10 h-12 w-12 -translate-y-1/2 rounded-xl text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
          onClick={() => navigate(`/room/${roomId}`)}
          aria-label="Voltar para a sala"
          title="Voltar para a sala"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Room details form — no box, no section title */}
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Carregando detalhes...
          </p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="room-name"
                className="pl-4 text-sm font-medium text-muted-foreground"
              >
                Nome da sala
              </label>
              <input
                id="room-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="Ex.: As Crônicas do Norte"
                maxLength={80}
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="room-subtitle"
                className="pl-4 text-sm font-medium text-muted-foreground"
              >
                Descrição (opcional)
              </label>
              <textarea
                id="room-subtitle"
                value={subtitle}
                onChange={(event) => {
                  setSubtitle(event.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="Uma breve descrição da sua aventura..."
                maxLength={240}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-muted-foreground">
                {success}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={saving || !hasChanges || !name.trim()}
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </form>
        )}

        {/* Players link */}
        <Link
          to={`/room/${roomId}/players`}
          className="group flex items-center justify-between rounded-xl border border-border bg-secondary/20 p-4 transition hover:border-border/80 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users size={16} />
              Jogadores
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Consulte os participantes e gerencie quem pode continuar nesta sala.
            </p>
          </div>
          <ChevronRight className="ml-4 h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </div>
    </div>
  </PageContainer>
)
}

export default RoomSettingsPage