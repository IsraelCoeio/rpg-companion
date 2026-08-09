import { cn } from '@/utils/cn'

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-secondary-foreground',
        className,
      )}
      {...props}
    />
  )
}
