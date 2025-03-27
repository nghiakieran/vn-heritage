import { Eye, EyeOff, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
   // Fake loading
    const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => (
      { ...prev, [name]: value }
    ))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle Submit
    
    // Validate Data
  }
  return (
    <div className='flex items-center justify-center sm:px-4 py-12'>
      <div className='max-w-md w-full animate-fade-up'>
        <div className='border shadow-lg rounded-lg border-heritage-light/50 bg-card text-card-foreground'>
          <div className='text-center p-6 space-y-1'>
            <h3 className='text-xl sm:text-2xl text-heritage-dark font-bold tracking-tight'>Tạo tài khoản mới</h3>
            <p className='text-sm text-muted-foreground'>Nhanh chóng và dễ dàng</p>
          </div>
          <div className='p-6 pt-0'>
            <form onSubmit={handleSubmit} action="" className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='username' className='text-sm font-medium'>Tên người dùng</label>
                <input
                  type="text"
                  id='username'
                  name='username'
                  required
                  placeholder='Nhập tên của bạn...'
                  value={formData.username}
                  onChange={handleChange}
                  className='w-full h-10 px-3 py-2 rounded-md border focus:ring-2 focus:ring-heritage focus:outline-none focus:border-none placeholder:text-muted-foreground text-sm'/>
              </div>
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>Email</label>
                <input
                  type="email"
                  id='email'
                  name='email'
                  required
                  placeholder='Nhập email...'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full h-10 px-3 py-2 rounded-md border focus:ring-2 focus:ring-heritage focus:outline-none focus:border-none placeholder:text-muted-foreground text-sm' />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold' htmlFor='password'>Mật khẩu</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    required
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm'
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className='absolute right-0 top-0 px-3 py-2 h-10' type='button'>
                    {
                      showPassword ? (
                        <EyeOff size={16} className='text-muted-foreground' />
                      ) : (
                        <Eye size={16} className='text-muted-foreground' />
                      )
                    }
                  </button>
                </div>
              </div>
              <div className='space-y-2'>
                <label htmlFor='confirmPassword' className='text-sm font-medium'>Xác nhận mật khẩu</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  required
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full h-10 px-3 py-2 rounded-md border focus:ring-2 focus:ring-heritage focus:outline-none focus:border-none placeholder:text-muted-foreground text-sm' />
              </div>
              <button type='submit' disabled={isLoading} onClick={() => setIsLoading(!isLoading)}
                className='flex items-center justify-center h-10 px-4 py-2 gap-2 text-sm rounded-md bg-heritage 
                text-primary-foreground font-medium w-full hover:bg-heritage-dark transition-colors'>
                {
                  isLoading ? (
                    <div className='flex items-center'>
                      <div className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full' />
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Đăng ký</span>
                    </>
                  )
                }
              </button>
            </form>
          </div>
          <div className='text-center pt-0 p-6 text-sm'>
            <span>Bạn đã có tài khoản ư? </span>
            <Link to='/login' className='text-heritage font-medium hover:underline'>Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
