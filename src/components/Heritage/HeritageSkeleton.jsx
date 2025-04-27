import HeritageSkeletonCard from './HeritageSkeletonCard'

const HeritageSkeleton = ({ count = 6 }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]'>
      {Array.from({ length: count }).map((_, index) => (
        <HeritageSkeletonCard key={index} />
      ))}
    </div>
  )
}
export default HeritageSkeleton
