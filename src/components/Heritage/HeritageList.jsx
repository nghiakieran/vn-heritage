import { cn } from '~/lib/utils'
import { lazy, Suspense } from 'react'
import HeritageSkeletonCard from './HeritageSkeletonCard'

const HeritageCard = lazy(() => import('./HeritageCard'))

const EmptyState = () => (
  <div role='alert' className='py-12 text-center text-muted-foreground'>
    <h4>Hiện chưa có di tích nào</h4>
  </div>
)

const HeritageList = ({ heritages, className }) => {
  if (!heritages?.length) {
    return <EmptyState />
  }

  return (
    <ul role='list' className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {heritages.map((item) => (
        <li key={item._id}>
          <Suspense fallback={<HeritageSkeletonCard />}>
            <HeritageCard item={item} />
          </Suspense>
        </li>
      ))}
    </ul>
  )
}

export default HeritageList
