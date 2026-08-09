import { cn } from '@/utils/cn'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card/90 shadow-xl shadow-black/20 backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-5 pb-3', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn('font-display text-lg font-semibold tracking-wide', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn('text-sm text-muted-foreground leading-relaxed', className)} {...props} />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}
