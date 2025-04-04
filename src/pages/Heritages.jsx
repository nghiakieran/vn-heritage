import { selectCurrentPage, selectItemsPerPage, selectSearchQuery } from '~/store/selectors/paginationSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { useLazyGetHeritagesQuery } from '~/store/apis/heritageApi'
import { setCurrentPage } from '~/store/slices/paginationSlice'
import HeritageList from '~/components/Heritage/HeritageList'
import HeritageSkeleton from '~/components/Heritage/HeritageSkeleton'

const Heritages = () => {

  const dispatch = useDispatch()
  const currentPage = useSelector(selectCurrentPage)
  const itemsPerPage = useSelector(selectItemsPerPage)
  const searchQuery = useSelector(selectSearchQuery)

  const [trigger, { data: response, isLoading, isFetching }] = useLazyGetHeritagesQuery()
  const heritages = response?.data || []
  const totalItems = response?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    trigger({ page: currentPage, limit: itemsPerPage, search: searchQuery || undefined })
  }, [currentPage, itemsPerPage, searchQuery, trigger])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPagination = () => {
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
  }
  console.log('re')
  return (
    <section className='pt-navbar-mobile sm:pt-navbar'>
      <div className='lcn-container min-h-screen'>
        <div className='text-center animate-fade-up'>
          <h1 className='text-3xl sm:text-4xl font-medium text-heritage-dark mb-4'>Khám phá các di tích lịch sử</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Tìm hiểu những địa danh văn hóa và lịch sử nổi bật trên khắp Việt Nam, nơi đã định hình nền văn minh của dân tộc.
          </p>
        </div>
        <div>
        {
          isLoading || isFetching ? 
            <HeritageSkeleton count={itemsPerPage} /> : heritages.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>
                  {
                    searchQuery ? 'Không tìm thấy di tích nào phù hợp.'
                    : 'Không có di tích nào để hiển thị.'
                  }
                </p>
              </div>
            ) : (
                <>
                  <HeritageList heritages={heritages} />
                  {
                    totalPages > 1 && (
                      <div className='mt-8 flex justify-center gap-2'>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || isFetching}
                          className='px-4 py-2 border rounded disabled:opacity-50'
                        >
                          Trước
                        </button>
                        { renderPagination() }
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || isFetching}
                          className='px-4 py-2 border rounded disabled:opacity-50'
                        >
                          Sau
                        </button>
                      </div>
                  )}
                </>
              )
        }
        </div>
      </div>
    </section>
  )
}

export default Heritages
