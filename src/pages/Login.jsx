import { Eye, EyeOff, LogIn } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  // Fake loading
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit ...
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => (
      { ...prev, [name]: value }
    ))
  }

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh -16rem)] sm:px-4 py-12'>
      <div className='max-w-md w-full animate-fade-up'>
        <div className='rounded-lg shadow-lg border border-heritage-light/50 bg-card text-card-foreground'>
          <div className='flex flex-col items-center p-6 gap-1'>
            <h3 className='text-xl sm:text-2xl text-heritage-dark font-bold tracking-tight'>Đăng nhập vào Heritage</h3>
            <p className='text-sm text-muted-foreground text-center'>Khám phá quá khứ, tận hưởng hiện tại</p>
          </div>
          <div className='pt-0 p-6'>
            <form onSubmit={handleSubmit} action='' className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium' htmlFor='email'>Email</label>
                <input 
                  type='email'
                  id='email'
                  name='email'
                  required
                  placeholder='Nhập email...'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm'
                />
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <label className='text-sm font-medium' htmlFor='password'>Mật khẩu</label>
                  <Link to='/forgot-password' className='text-xs text-heritage hover:underline'>Quên mật khẩu?</Link>
                </div>
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
                        <EyeOff size={16} className='text-muted-foreground'/>
                      ) : (
                        <Eye size={16} className='text-muted-foreground'/>
                      ) 
                    }
                  </button>
                </div>
              </div>
              <button 
                type='submit' 
                className='flex items-center justify-center gap-2 text-sm rounded-md px-4 py-2 h-10 bg-heritage text-primary-foreground font-medium w-full
                  hover:bg-heritage-dark transition-colors'
                disabled={isLoading}
                onClick={() => setIsLoading(!isLoading)}
              >
                {
                  isLoading ? (
                    <div className='flex items-center'>
                      <div className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full' />
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Đăng nhập</span>
                    </>
                  )
                }
              </button>
            </form>
          </div>
          <div className='text-center pt-0 p-6 text-sm'>
            <span>Bạn chưa có tài khoản ư? </span>
            <Link to='/register' className='text-heritage font-medium hover:underline'>Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
