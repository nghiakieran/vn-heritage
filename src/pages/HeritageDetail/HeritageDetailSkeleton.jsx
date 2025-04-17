
const HeritageDetailSkeleton = () => {
  return (
    <div className='lcn-container-x py-8'>
      <div className='animate-pulse'>
        <div className='h-72 bg-gray-200 rounded-lg mb-8'></div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
          <div className='sm:col-span-2'>
            <div className='h-8 w-64 bg-gray-200 rounded mb-4'></div>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 bg-gray-200 rounded mb-8'></div>
            <div className='flex space-x-2 mb-6'>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className='h-10 bg-gray-200 rounded flex-1'></div>
              ))}
            </div>
            <div className='h-64 bg-gray-200 rounded mb-8'></div>
          </div>
          <div>
            <div className='h-64 bg-gray-200 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeritageDetailSkeleton
