import { cn } from '~/lib/utils'
import HeritageCard from './HeritageCard'

const HeritageList = ({ heritages, className }) => {
  console.log(heritages);
  if (heritages?.length === 0) return (
    <h4 className='text-muted-foreground text-center py-12'>Hiện chưa có di tích nào</h4>
  )
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {
        heritages?.map(item => (
          <HeritageCard key={item._id} item={item} />
        ))
      }
    </div>
  )
}

export default HeritageList
