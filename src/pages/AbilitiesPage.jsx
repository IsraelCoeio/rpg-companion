import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import useGameStore from '@/store/useGameStore'
import PageContainer from '@/components/layout/PageContainer'
import ScreenPlaceholder from '@/components/layout/ScreenPlaceholder'
import { Button } from '@/components/ui/button'

function AbilitiesPage() {
  const character = useGameStore(
    (state) => state.character
  )

  const abilities = character?.abilities ?? []

  const [currentIndex, setCurrentIndex] = useState(0)

  if (abilities.length === 0) {
    return (
      <PageContainer>
        <ScreenPlaceholder
          eyebrow="Abilities"
          title="No abilities"
          description="This character has no abilities yet."
        />
      </PageContainer>
    )
  }

  const currentAbility = abilities[currentIndex]

  function previousAbility() {
    setCurrentIndex((index) =>
      index === 0
        ? abilities.length - 1
        : index - 1
    )
  }

  function nextAbility() {
    setCurrentIndex((index) =>
      index === abilities.length - 1
        ? 0
        : index + 1
    )
  }

  return (
    <PageContainer>
      <ScreenPlaceholder
        eyebrow="Abilities"
        title={character?.name}
        description="Swipe to view your abilities."
      >
        <div className="space-y-4">

          {/* Ability Card */}
          <div className="rounded-2xl border border-border bg-secondary/40 p-6">

            <h2 className="font-display text-2xl">
              {currentAbility.name}
            </h2>

            <p className="mt-3 text-muted-foreground">
              {currentAbility.description}
            </p>

          </div>


          {/* Controls */}
          <div className="flex justify-between gap-3">

            <Button
              variant="secondary"
              onClick={previousAbility}
            >
              <ChevronLeft />
            </Button>


            <p className="flex items-center text-sm text-muted-foreground">
              {currentIndex + 1}/{abilities.length}
            </p>


            <Button
              variant="secondary"
              onClick={nextAbility}
            >
              <ChevronRight />
            </Button>

          </div>

        </div>
      </ScreenPlaceholder>
    </PageContainer>
  )
}

export default AbilitiesPage