import HeritageCardSkeleton from "./HeritageCardSkeleton"

const HeritageSkeleton = ({ count }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <HeritageCardSkeleton key={index} />
        ))}
    </div>
  )
}

export default HeritageSkeleton
