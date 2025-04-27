import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '~/components/common/ui/Button'
import { useRegisterMutation } from '~/store/apis/authSlice'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [register] = useRegisterMutation()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const { email, phone, password, confirmPassword } = formData
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Vui lòng nhập email hợp lệ.'
    }
    if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
      return 'Vui lòng nhập số điện thoại hợp lệ (10-15 chữ số).'
    }
    if (!password || password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự.'
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp.'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Call the register API
      await register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }).unwrap()

      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
      navigate('/authen-confirm', { state: { email: formData.email } })
    } catch (err) {
      const errorMessage = err?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center sm:px-4 py-12 mt-navbar-mobile sm:mt-navbar'>
      <div className='max-w-md w-full animate-fade-up'>
        <div className='border shadow-lg rounded-lg border-heritage-light/50 bg-card text-card-foreground'>
          <div className='text-center p-6 space-y-1'>
            <h3 className='text-xl sm:text-2xl text-heritage-dark font-bold tracking-tight'>Tạo tài khoản mới</h3>
            <p className='text-sm text-muted-foreground'>Nhanh chóng và dễ dàng</p>
          </div>
          <div className='p-6 pt-0'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && <div className='text-red-500 text-sm text-center'>{error}</div>}
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  placeholder='Nhập email...'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full h-10 px-3 py-2 rounded-md border focus:ring-2 focus:ring-heritage focus:outline-none focus:border-none placeholder:text-muted-foreground text-sm'
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='phone' className='text-sm font-medium'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  required
                  placeholder='Nhập số điện thoại...'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full h-10 px-3 py-2 rounded-md border focus:ring-2 focus:ring-heritage focus:outline-none focus:border-none placeholder:text-muted-foreground text-sm'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold' htmlFor='password'>
                  Mật khẩu
                </label>
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
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-0 top-0 px-3 py-2 h-10'
                    type='button'
                  >
                    {showPassword ? (
                      <EyeOff size={16} className='text-muted-foreground' />
                    ) : (
                      <Eye size={16} className='text-muted-foreground' />
                    )}
                  </button>
                </div>
              </div>
              <div className='space-y-2'>
                <label htmlFor='confirmPassword' className='text-sm font-medium'>
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  required
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full h-10 px-3 py-2 rounded-md border focus:ring-2 focus:ring-heritage focus:outline-none focus:border-none placeholder:text-muted-foreground text-sm'
                />
              </div>
              <Button type='submit' disabled={isLoading} className='w-full'>
                {isLoading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full' />
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Đăng ký</span>
                  </>
                )}
              </Button>
            </form>
          </div>
          <div className='text-center pt-0 p-6 text-sm'>
            <span>Bạn đã có tài khoản ư? </span>
            <Link to='/login' className='text-heritage font-medium hover:underline'>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
