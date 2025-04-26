import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  paginationButtons, 
  handlePageChange, 
  isLoading 
}) => {
  if (totalPages <= 1) return null
  
  return (
    <div className='mt-8 flex justify-center gap-2'>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className='px-4 py-2 border rounded disabled:opacity-50'
        aria-label='Previous Page'
      >
        <ChevronLeft size={20} />
      </button>
      
      {paginationButtons.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className='px-4 py-2'>...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => handlePageChange(page)}
            disabled={isLoading}
            className={`px-4 py-2 border rounded ${
              currentPage === page ? 'bg-heritage-dark text-white' : ''
            }`}
          >
            {page}
          </button>
        )
      )}
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className='px-4 py-2 border rounded disabled:opacity-50'
        aria-label='Next Page'
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
