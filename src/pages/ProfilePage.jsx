import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'

function ProfilePage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Perfil"
        title="Perfil do Aventureiro"
        description="A estrutura do perfil está disponível para preferências futuras dos jogadores e identidade da campanha."
      >
        <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
          <p className="text-sm text-muted-foreground">Profile content foundation is ready.</p>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default ProfilePage
