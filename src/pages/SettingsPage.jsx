import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'

function SettingsPage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Configurações"
        title="Configurações da Aplicação"
        description="A estrutura de configuração principal está completa e pronta para futuros toggles e preferências."
      >
        <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
          <p className="text-sm text-muted-foreground">Settings foundation is active.</p>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default SettingsPage
