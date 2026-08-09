import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'

function GalleryPage() {
  const galleryPreview = [
    '/images/relic-hall.svg',
    '/images/ember-gate.svg',
    '/images/moon-archive.svg',
  ]

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Gallery"
        title="Shared Image Gallery"
        description="Gallery page points to local public image strategy for MVP and is ready for visual expansion."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {galleryPreview.map((imagePath) => (
            <div
              key={imagePath}
              className="overflow-hidden rounded-xl border border-border/70 bg-secondary/45"
            >
              <img
                src={imagePath}
                alt="Fantasy gallery preview"
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default GalleryPage
