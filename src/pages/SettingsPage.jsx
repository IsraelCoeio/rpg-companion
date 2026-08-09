import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'

function SettingsPage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Settings"
        title="Application Settings"
        description="Core configuration screen shell is complete and prepared for future toggles and preferences."
      >
        <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
          <p className="text-sm text-muted-foreground">Settings foundation is active.</p>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default SettingsPage
