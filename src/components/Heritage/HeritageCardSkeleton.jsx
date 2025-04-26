const HeritageCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden border shadow animate-pulse">
    <div className="aspect-[3/2] w-full bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
)

export default HeritageCardSkeleton
