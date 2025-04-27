import { Loader2 } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-heritage-light/20 rounded-full' />
          <div className='absolute top-0 left-0 w-16 h-16 border-4 border-heritage border-t-transparent rounded-full animate-spin' />
        </div>
        <p className='text-heritage-dark font-medium'>Đang tải...</p>
      </div>
    </div>
  )
}

export default LoadingScreen 