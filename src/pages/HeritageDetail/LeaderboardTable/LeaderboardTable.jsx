import { useEffect, useState, useRef, useCallback } from 'react'
import { Trophy } from 'lucide-react'

import { useGetLeaderboardByHeritageIdQuery } from '~/store/apis/leaderboardApi'
import { Button } from '~/components/common/ui/Button'
import Spinner from '~/components/common/ui/Spinner'
import TableRow from './TableRow'

const LeaderboardTable = ({ heritageId, heritageName = 'Di tích lịch sử', isOpen = false }) => {
  const [page, setPage] = useState(1)
  const [rankings, setRankings] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef(null) // IntersectionObserver
  const dialogStateRef = useRef({ wasOpen: false, prevHeritageId: null }) 
  //Lưu trạng thái dialog => để kiểm tra xem có cần reset không


  // Hàm reset state
  const resetLeaderboard = useCallback(() => {
    setPage(1)
    setRankings([])
    setHasMore(true)
  }, [])

  // Kiểm tra cần reset không
  useEffect(() => {
    if (!isOpen) {
      dialogStateRef.current.wasOpen = false
      return
    }

    const needsReset = 
      !dialogStateRef.current.wasOpen || 
      (dialogStateRef.current.prevHeritageId !== heritageId)

    if (needsReset) {
      resetLeaderboard()
    }

    dialogStateRef.current.wasOpen = true
    dialogStateRef.current.prevHeritageId = heritageId
  }, [isOpen, heritageId, resetLeaderboard])

  // API query
  const { data, isLoading, isFetching, error, refetch } = useGetLeaderboardByHeritageIdQuery(
    { heritageId, page, limit: 20 },
    { skip: !heritageId || !isOpen }
  )

  // Cập nhật dữ liệu khi API trả về
  useEffect(() => {
    if (!data || !isOpen) return

    if (data.rankings?.length > 0) {
      setRankings(prev => page === 1 ? data.rankings : [...prev, ...data.rankings])
      setHasMore(data.pagination.totalPages > page)
    } else if (page === 1) {
      setRankings([])
    }
  }, [data, page, isOpen])

  // Infinite scroll
  useEffect(() => {
    if (!isOpen || !loaderRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetching) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, isFetching, isOpen])

  // Các utility function
  const formatDate = date => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  const getInitials = name => name?.slice(0, 2).toUpperCase()

  const getRankIcon = rank => {
    const colors = {
      1: 'text-yellow-500',
      2: 'text-gray-400',
      3: 'text-amber-700',
    }
    return colors[rank] ? <Trophy className={`h-5 w-5 ${colors[rank]}`} /> : null
  }

  if (!isOpen) return null

  if (isLoading && page === 1) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center p-3 rounded-md bg-white border border-gray-300'>
            <div className='w-8 h-6 bg-gray-200 rounded animate-pulse'></div>
            <div className='mx-3'>
              <div className='h-10 w-10 rounded-full bg-gray-200 animate-pulse'></div>
            </div>
            <div className='flex-1'>
              <div className='h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded w-1/3 animate-pulse'></div>
            </div>
            <div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-destructive font-medium'>Đã xảy ra lỗi khi tải dữ liệu</p>
        <p className='text-muted-foreground mt-2'>{error?.data?.message || 'Vui lòng thử lại sau'}</p>
        <Button
          onClick={() => {
            resetLeaderboard()
            refetch()
          }}
          className='mt-4'
        >
          Thử lại
        </Button>
      </div>
    )
  }

  if (rankings.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>
          Chưa có người dùng nào hoàn thành khám phá {heritageName}.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4 overflow-y-auto h-96'>
      <div className='flex items-center p-3 border-b text-sm text-muted-foreground font-medium'>
        <div className='w-8 text-center'>Hạng</div>
        <div className='w-16'></div>
        <div className='flex-1'>Người dùng</div>
        <div>Điểm số</div>
      </div>

      <div className='space-y-1'>
        {rankings.map(ranking => (
          <TableRow
            key={ranking.userId}
            ranking={ranking}
            formatDate={formatDate}
            getInitials={getInitials}
            getRankIcon={getRankIcon}
          />
        ))}

        <div ref={loaderRef} className='h-4' />

        {isFetching && (
          <div className='text-center py-2 text-sm text-muted-foreground'>
            <Spinner /> Đang tải thêm...
          </div>
        )}

        {!hasMore && (
          <div className='text-center py-2 text-muted-foreground text-sm'>
            Đã hiển thị toàn bộ {rankings.length} người dùng
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardTable