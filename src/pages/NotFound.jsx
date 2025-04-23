import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { Button } from '~/components/common/ui/Button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      'Lỗi 404: Người dùng truy cập đường dẫn không tồn tại:',
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center animate-fade-in space-y-6'>
        <h1 className='text-8xl font-extrabold'>404</h1>
        <p className='text-xl font-medium text-muted-foreground'>Ôi không! Trang bạn đang tìm kiếm không tồn tại.</p>
        <Link to='/' className='inline-block'>
          <Button>Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
