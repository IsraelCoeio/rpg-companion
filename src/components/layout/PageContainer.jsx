import { cn } from '@/utils/cn'

function PageContainer({ className, children }) {
  return (
    <section className={cn('mx-auto w-full max-w-3xl space-y-5 px-4 py-5 sm:px-6', className)}>
      {children}
    </section>
  )
}

export default PageContainer
