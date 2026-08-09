import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function ScreenPlaceholder({ eyebrow, title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <Badge>{eyebrow}</Badge>
        <CardTitle className="mt-3 text-2xl">{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default ScreenPlaceholder
