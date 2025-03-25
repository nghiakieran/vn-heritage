import { Search, X } from 'lucide-react'
import React from 'react'

const SearchBar = ({ searchValue, setSearchValue, inputRef }) => {
  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  const handleChange = (e) => {
    const searchValue = e.target.value
    if (!searchValue.startsWith(' ')) setSearchValue(searchValue)
  }

  return (
    <div className='flex relative'>
      <input
        ref={inputRef}
        aria-label='Tìm kiếm'
        placeholder='Tìm kiếm di tích...'
        onChange={handleChange}
        value={searchValue}
        className='border rounded-full w-[150px] sm:w-[200px] pr-8 sm:pr-10 sm:px-5 sm:py-2 px-3 py-2 text-xs sm:text-sm focus:border-gray-500 focus:outline-none'
      />
      <button 
        aria-label='Tìm kiếm'
        className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-accent-foreground transition-all active:scale-90'>
        {searchValue ? (
          <X onClick={handleClear} className='size-5 sm:size-5' />
        ) : (
          <Search className='size-5 sm:size-5' />
        )}
      </button>
    </div>
  )
}

export default SearchBar
