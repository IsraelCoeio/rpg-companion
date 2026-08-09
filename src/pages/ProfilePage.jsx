import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'

function ProfilePage() {
  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Profile"
        title="Adventurer Profile"
        description="Profile structure is available for future player preferences and campaign identity."
      >
        <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
          <p className="text-sm text-muted-foreground">Profile content foundation is ready.</p>
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default ProfilePage
