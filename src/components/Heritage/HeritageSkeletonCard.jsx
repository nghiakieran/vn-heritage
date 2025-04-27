const HeritageSkeletonCard = () => {
  return (
    <div className='flex flex-col h-full overflow-hidden rounded-lg border bg-card shadow-sm'>
      {/* Image skeleton */}
      <div className='relative overflow-hidden'>
        <div className='aspect-[3/2] w-full bg-gray-200 animate-pulse' />
      </div>
      
      {/* Content skeleton */}
      <div className='flex flex-col flex-grow p-4'>
        <div className='h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse' />
        <div className='h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse' />
        <div className='h-4 w-full bg-gray-200 rounded animate-pulse' />
      </div>
    </div>
  )
}

export default HeritageSkeletonCard
