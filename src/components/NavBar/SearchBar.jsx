import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'

import { selectHeritagesSearchQuery } from '~/store/selectors/paginationSelectors'
import { setHeritagesSearchQuery } from '~/store/slices/paginationSlice'
import useDebounce from '~/hooks/useDebounce'

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef(null)
  const dispatch = useDispatch()
  const searchQuery = useSelector(selectHeritagesSearchQuery)
  const [searchValue, setSearchValue] = useState(searchQuery)
  const debouncedValue = useDebounce(searchValue, 500)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }
  
  const handleChange = (e) => {
    const searchValue = e.target.value
    if (!searchValue.startsWith(' ')) {
      setIsSearching(true)
      setSearchValue(searchValue)
    }
  }

  useEffect(() => {
    if (debouncedValue !== searchQuery) {
      dispatch(setHeritagesSearchQuery(debouncedValue))
      setIsSearching(false)

      if (debouncedValue.trim() && location.pathname !== '/heritages') {
        navigate('/heritages')
      }
    }

  }, [debouncedValue, searchQuery, dispatch, location.pathname, navigate])

  return (
    <div className='flex relative'>
      <input
        ref={inputRef}
        aria-label='Tìm kiếm'
        placeholder='Tìm kiếm di tích...'
        onChange={handleChange}
        value={searchValue}
        className='border rounded-full w-[150px] sm:w-[200px] pr-8 sm:pr-10 sm:px-5 sm:py-2 px-3 py-2 text-[13px] sm:text-sm focus:border-gray-500 focus:outline-none'
      />
      <button 
        aria-label='Tìm kiếm'
        className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-accent-foreground transition-all active:scale-90'>
        {
          isSearching ? (
            <Loader2 className='animate-spin size-5 sm:size-5' />
          ) : searchValue ? (
            <X onClick={handleClear} className='size-5 sm:size-5' />
          ) : (
            <Search className='size-5 sm:size-5' />
          )
        }
      </button>
    </div>
  )
}

export default SearchBar
