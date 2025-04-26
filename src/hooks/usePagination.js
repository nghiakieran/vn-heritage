import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

/**
 * Custom hook to handle pagination logic with Redux integration
 * @param {number} totalPages - Total number of pages
 * @param {number} currentPage - Current page from Redux state
 * @param {Function} setPageAction - Redux action creator to set page
 * @returns Pagination state and handlers
 */
export const usePagination = (totalPages, currentPage, setPageAction) => {
  const dispatch = useDispatch()

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setPageAction(page))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [dispatch, totalPages, setPageAction])

  const setCurrentPage = useCallback((page) => {
    dispatch(setPageAction(page))
  }, [dispatch, setPageAction])

  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return []

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

    return pages
  }, [currentPage, totalPages])

  return {
    currentPage,
    setCurrentPage,
    handlePageChange,
    paginationButtons,
    totalPages
  }
}
