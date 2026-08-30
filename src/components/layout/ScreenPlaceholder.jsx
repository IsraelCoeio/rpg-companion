import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function ScreenPlaceholder({ eyebrow, title, description, children }) {
  const hasHeader =
    eyebrow || title || description

  return (
    <Card>
      {hasHeader && (
        <CardHeader>
          {eyebrow && <Badge>{eyebrow}</Badge>}
          {title && (
            <CardTitle className="mt-3 text-2xl">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="mt-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className={!hasHeader ? 'pt-6' : undefined}>
        {children}
      </CardContent>
    </Card>
  )
}

export default ScreenPlaceholder
