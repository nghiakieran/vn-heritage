import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'

import { setHeritagesSearchQuery } from '~/store/slices/paginationSlice'
import { selectHeritagesSearchQuery } from '~/store/selectors/paginationSelectors'

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef(null)
  const dispatch = useDispatch()
  const searchQuery = useSelector(selectHeritagesSearchQuery)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClear = () => {
    setSearchValue('')
    dispatch(setHeritagesSearchQuery('')) // Clear the search query in Redux
    inputRef.current?.focus()
  }

  const handleSearch = () => {
    if (searchValue !== searchQuery) {
      setIsSearching(true)
      dispatch(setHeritagesSearchQuery(searchValue))
      setIsSearching(false)

      if (searchValue.trim() && location.pathname !== '/heritages') {
        navigate('/heritages')
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    if (!value.startsWith(' ')) {
      setSearchValue(value)
    }
  }

  return (
    <div className='flex relative items-center'>
      <input
        ref={inputRef}
        aria-label='Tìm kiếm'
        placeholder='Tìm kiếm di tích...'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={searchValue}
        className='border rounded-full w-[150px] sm:w-[200px] pr-8 sm:pr-10 sm:px-5 sm:py-2 px-3 py-2 text-[13px] sm:text-sm focus:border-gray-500 focus:outline-none'
      />
      {searchValue && (
        <button
          aria-label='Xóa'
          onClick={handleClear}
          className='absolute top-1/2 right-10 -translate-y-1/2 text-muted-foreground hover:text-accent-foreground transition-all active:scale-90'
        >
          <X className='size-5 sm:size-5' />
        </button>
      )}
      <button
        aria-label='Tìm kiếm'
        onClick={handleSearch}
        className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-accent-foreground transition-all active:scale-90'
      >
        {isSearching ? (
          <Loader2 className='animate-spin size-5 sm:size-5' />
        ) : (
          <Search className='size-5 sm:size-5' />
        )}
      </button>
    </div>
  )
}

export default SearchBar