import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useCallback } from 'react'

import { heritageApi, useLazyGetHeritagesQuery } from '~/store/apis/heritageApi'
import { setHeritagesPage } from '~/store/slices/paginationSlice'
import HeritageList from '~/components/Heritage/HeritageList'
import HeritageSkeleton from '~/components/Heritage/HeritageSkeleton'
import {
  selectHeritagesCurrentPage,
  selectHeritagesItemsPerPage,
  selectHeritagesSearchQuery,
} from '~/store/selectors/paginationSelectors'
import { Pagination } from '~/components/common/Pagination'
import { usePagination } from '~/hooks/usePagination'

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

  const { heritages, totalPages } = useMemo(() => ({
    heritages: response?.heritages || [],
    totalPages: response?.pagination?.totalPages || 1
  }), [response])

  const { 
    handlePageChange, 
    paginationButtons 
  } = usePagination(totalPages, currentPage, setHeritagesPage)

  useEffect(() => {
    trigger(queryParams)
  }, [queryParams, trigger])

  const prefetchNextPage = useCallback(() => {
    if (currentPage < totalPages && heritages.length > 0) {
      const nextPageParams = {
        ...queryParams,
        page: currentPage + 1
      }
      dispatch(heritageApi.util.prefetch('getHeritages', nextPageParams, { force: false }))
    }
  }, [currentPage, totalPages, heritages.length, queryParams, dispatch])

  // Trigger prefetch khi dữ liệu được tải
  useEffect(() => {
    if (!isLoading && !isFetching && heritages.length > 0) {
      prefetchNextPage()
    }
  }, [prefetchNextPage, isLoading, isFetching, heritages.length])

  const renderContent = () => {
    if (isLoading || isFetching) {
      return <HeritageSkeleton count={itemsPerPage} />
    }
    
    if (error) {
      return (
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
    }
    
    if (heritages.length === 0) {
      return (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            {searchQuery
              ? 'Không tìm thấy di tích nào phù hợp.'
              : 'Không có di tích nào để hiển thị.'}
          </p>
        </div>
      )
    }
    
    return (
      <>
        <HeritageList heritages={heritages} />
        
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginationButtons={paginationButtons}
            handlePageChange={handlePageChange}
            isLoading={isFetching}
          />
        )}
      </>
    )
  }

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
        <div>{renderContent()}</div>
      </div>
    </section>
  )
}

export default Heritages