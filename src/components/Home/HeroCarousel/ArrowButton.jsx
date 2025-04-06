import { ChevronLeft, ChevronRight } from 'lucide-react'

const ArrowButton = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 ${direction === 'left' ? 'left-4' : 'right-4'} text-primary-foreground w-10 h-10 sm:w-12 sm:h-12 z-30 -translate-y-1/2
    bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
    >
      { direction === 'left' ? ( <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6' /> ) : ( <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6' /> ) }
    </button>
  )
}

export default ArrowButton
