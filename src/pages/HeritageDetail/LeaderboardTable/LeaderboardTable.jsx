import { useEffect, useState, useRef } from 'react'
import { useGetLeaderboardByHeritageIdQuery } from '~/store/apis/leaderboardApi'
import { Trophy } from 'lucide-react'
import Spinner from '~/components/common/ui/Spinner'
import { Button } from '~/components/common/ui/Button'

const TableRow = ({ ranking, formatDate, getInitials, getRankIcon }) => (
  <div className="flex items-center p-3 rounded-md bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
    <div className="w-8 text-center font-medium flex justify-center">
      {getRankIcon(ranking?.rank) || ranking?.rank}
    </div>
    <div className="mx-3">
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
        {ranking?.avatarUrl ? (
          <img loading="lazy" src={ranking?.avatarUrl} alt={ranking?.displayName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-secondary-foreground font-medium">
            {getInitials(ranking?.displayName)}
          </span>
        )}
      </div>
    </div>
    <div className="flex-1">
      <div className="font-medium text-foreground">{ranking?.displayName}</div>
      <div className="text-sm text-muted-foreground">Hoàn thành: {formatDate(ranking?.completeDate)}</div>
    </div>
    <div className="font-bold text-heritage-primary">{ranking?.score} điểm</div>
  </div>
);

const LeaderboardTable = ({ heritageId, heritageName = 'Di tích lịch sử' }) => {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [rankings, setRankings] = useState([])
  const loaderRef = useRef(null)

  const { data, isLoading, isFetching, error, refetch } = useGetLeaderboardByHeritageIdQuery(
    { heritageId, page, limit: 20 },
    { skip: !heritageId }
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(date)
  }

  const getInitials = (name) => name?.substring(0, 2).toUpperCase()

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-700" />
    return null
  }

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setRankings(data.rankings || [])
      } else {
        setRankings(prev => [...prev, ...(data.rankings || [])])
      }

      setHasMore(data.pagination.totalPages > page)
    }
  }, [data, page])

  useEffect(() => {
    if (heritageId) {
      setPage(1)
      setRankings([])
      setHasMore(true)
    }
  }, [heritageId])

 useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1)
      }
    },
    { threshold: 0.1 }
  )

  const currentLoader = loaderRef.current // snapshot lại giá trị ref hiện tại

  if (currentLoader) {
    observer.observe(currentLoader)
  }

  return () => {
    if (currentLoader) {
      observer.unobserve(currentLoader)
    }
  }
}, [hasMore, isFetching])


  const renderLoadingState = () => (
    <div className="space-y-2">
      {Array(5).fill(0).map((_, index) => (
        <div key={index} className="flex items-center p-3 rounded-md bg-white border border-gray-300">
          <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="mx-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      ))}
    </div>
  )

  const renderErrorState = () => (
    <div className="text-center py-8">
      <p className="text-destructive font-medium">Đã xảy ra lỗi khi tải dữ liệu</p>
      <p className="text-muted-foreground mt-2">
        {error?.data?.message || 'Vui lòng thử lại sau'}
      </p>
      <Button
        onClick={() => {
          setPage(1)
          setRankings([])
          setHasMore(true)
          refetch()
        }}
        variant="default"
        className="mt-4"
      >
        Thử lại
      </Button>
    </div>
  )

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        Chưa có người dùng nào hoàn thành khám phá {heritageName}.
      </p>
    </div>
  )

  const renderContent = () => {
    if (isLoading && page === 1) {
      return renderLoadingState()
    }

    if (error) {
      return renderErrorState()
    }

    if (rankings.length === 0) {
      return renderEmptyState()
    }

    return (
      <div className="space-y-1">
        {rankings.map((ranking) => (
          <TableRow
            key={ranking?.userId}
            ranking={ranking}
            formatDate={formatDate}
            getInitials={getInitials}
            getRankIcon={getRankIcon}
          />
        ))}
        <div ref={loaderRef} className="h-4" />
        {isFetching && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            <Spinner /> Đang tải thêm...
          </div>
        )}
        {!hasMore && rankings.length > 0 && (
          <div className="text-center py-2 text-muted-foreground text-sm">
            Đã hiển thị toàn bộ {rankings.length} người dùng
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 overflow-y-auto h-96">
      <div className="flex items-center p-3 border-b text-sm text-muted-foreground font-medium">
        <div className="w-8 text-center">Hạng</div>
        <div className="w-16"></div>
        <div className="flex-1">Người dùng</div>
        <div>...</div>
      </div>
      {renderContent()}
    </div>
  )
}

export default LeaderboardTable
