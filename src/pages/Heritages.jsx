import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { heritageApi, useLazyGetHeritagesQuery } from '~/store/apis/heritageApi'
import HeritageList from '~/components/Heritage/HeritageList'
import HeritageSkeleton from '~/components/Heritage/HeritageSkeleton'
import { setHeritagesPage } from '~/store/slices/paginationSlice'
import { selectHeritagesCurrentPage, selectHeritagesItemsPerPage, selectHeritagesSearchQuery } from '~/store/selectors/paginationSelectors'

const Heritages = () => {
  const dispatch = useDispatch()
  
  const currentPage = useSelector(selectHeritagesCurrentPage)
  const itemsPerPage = useSelector(selectHeritagesItemsPerPage)
  const searchQuery = useSelector(selectHeritagesSearchQuery)

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    name: searchQuery || undefined
  }), [currentPage, itemsPerPage, searchQuery])
  

  const [trigger, { data: response, isLoading, isFetching, error }] = useLazyGetHeritagesQuery()

  const { heritages, totalPages } = useMemo(() => {
    const heritages = response?.heritages || []
    const pagination = response?.pagination || {}
    const totalPages = pagination.totalPages ?? 1
    return { heritages, totalPages }
  }, [response])

  useEffect(() => {
    trigger(queryParams)
  }, [queryParams, trigger])

  // Handle page change
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setHeritagesPage(page))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [dispatch, totalPages])

  // Prefetch next page
  const prefetchNextPage = useCallback(() => {
    if (currentPage < totalPages && (!searchQuery || heritages.length > 0) && !error) {
      const nextPageParams = {
        page: currentPage + 1,
        limit: itemsPerPage,
        name: searchQuery || undefined
      }
      dispatch(heritageApi.util.prefetch('getHeritages', nextPageParams, { force: false } ))
    }
  }, [currentPage, totalPages, itemsPerPage, searchQuery, heritages.length, error, dispatch])

  // Trigger prefetch when data is loaded
  useEffect(() => {
    if (!isLoading && !isFetching) {
      prefetchNextPage()
    }
  }, [prefetchNextPage, isLoading, isFetching])

  // Pagination UI generator
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null
    
    const pages = []
    const maxPagesToShow = 5
    const half = Math.floor(maxPagesToShow / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxPagesToShow - 1)

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1)
    }

    if (start > 1) pages.push(1)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    if (end < totalPages) pages.push(totalPages)

    return pages.map((page, index) =>
      page === '...' ? (
        <span key={index} className='px-4 py-2'>...</span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={isFetching}
          className={`px-4 py-2 border rounded ${
            currentPage === page ? 'bg-heritage-dark text-white' : ''
          }`}
        >
          {page}
        </button>
      )
    )
  }, [currentPage, totalPages, isFetching, handlePageChange])

  // Render loading state Skeleton
  const renderLoadingState = () => (
    <HeritageSkeleton count={itemsPerPage} />
  )

  // Render empty state
  const renderEmptyState = () => (
    <div className='text-center py-12'>
      <p className='text-muted-foreground'>
        {searchQuery
          ? 'Không tìm thấy di tích nào phù hợp.'
          : 'Không có di tích nào để hiển thị.'}
      </p>
    </div>
  )

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null
    
    return (
      <div className='mt-8 flex justify-center gap-2'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
          className='px-4 py-2 border rounded disabled:opacity-50'
          aria-label='Previous Page'
        >
          <ChevronLeft size={20} />
        </button>
        
        {paginationButtons}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isFetching}
          className='px-4 py-2 border rounded disabled:opacity-50'
          aria-label='Next Page'
        >
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  // Render error state
  const renderErrorState = () => (
    <div className='text-center py-12'>
      <p className='text-destructive font-medium'>
        Đã xảy ra lỗi khi tải dữ liệu
      </p>
      <p className='text-muted-foreground mt-2'>
        {error?.data?.message || 'Vui lòng thử lại sau'}
      </p>
      <button 
        onClick={() => trigger(queryParams)}
        className='mt-4 px-4 py-2 bg-heritage-dark text-white rounded hover:bg-heritage-dark/90 transition-colors'
      >
        Thử lại
      </button>
    </div>
  )

  return (
    <section className='pt-navbar-mobile sm:pt-navbar'>
      <div className='lcn-container min-h-screen'>
        {/* Header */}
        <div className='text-center animate-fade-up'>
          <h1 className='text-3xl sm:text-4xl font-medium text-heritage-dark mb-4'>
            Khám phá các di tích lịch sử
          </h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Tìm hiểu những địa danh văn hóa và lịch sử nổi bật trên khắp Việt
            Nam, nơi đã định hình nền văn minh của dân tộc.
          </p>
        </div>
        
        {/* Content */}
        <div>
          {isLoading || isFetching ? (
            renderLoadingState()
          ) : error ? (
            renderErrorState()
          ) : heritages?.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <HeritageList heritages={heritages} />
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Heritages
