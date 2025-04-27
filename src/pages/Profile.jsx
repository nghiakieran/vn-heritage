import { useState, useEffect, useMemo } from 'react'
import { useGetUserProfileQuery, useUpdateUserMutation, useUploadAvatarMutation } from '../store/apis/userSlice'
import { toast } from 'react-toastify'
import { Button } from '~/components/common/ui/Button'
import Title from '~/components/common/Title'
import { Camera, Check, Loader2, X } from 'lucide-react'
import { toDateInputFormat } from '~/utils/dateHelpers'
const DEFAULT_AVATAR = '/images/avatar-default.jpg'


const UserProfile = () => {
  const { data: user } = useGetUserProfileQuery()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()
  const initialFormData = useMemo(
    () => ({
      displayname: user?.displayname || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      dateOfBirth: user?.dateOfBirth || toDateInputFormat(user?.dateOfBirth),
      avatar: user?.avatar || DEFAULT_AVATAR,
    }),
    [user]
  )

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || DEFAULT_AVATAR)
  const [isAvatarChanged, setIsAvatarChanged] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [errors, setErrors] = useState({})

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 1MB')
        return
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.error('Chỉ chấp nhận file ảnh định dạng JPEG, PNG hoặc GIF')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        setAvatarPreview(dataUrl)
        setAvatarFile(file)
        setIsAvatarChanged(true)
        toast.info('Ảnh đại diện sẽ được cập nhật khi bạn lưu thay đổi')
      }
      reader.onerror = () => {
        toast.error('Không thể đọc file ảnh')
      }
      reader.readAsDataURL(file)
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    if (!formData.displayname.trim()) {
      newErrors.displayname = 'Tên hiển thị không được để trống'
    } else if (formData.displayname.length < 3) {
      newErrors.displayname = 'Tên hiển thị phải có ít nhất 3 ký tự'
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ (10-11 số)'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]
      const errorElement = document.getElementById(firstErrorField)
      if (errorElement) errorElement.focus()
      toast.error('Vui lòng kiểm tra lại thông tin nhập vào')
    }

    return Object.keys(newErrors).length === 0
  }

  // Handle form submission with avatar upload
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const toastId = toast.loading('Đang cập nhật thông tin...')

    try {
      let avatarUrl = null
      // Upload new avatar if changed
      if (isAvatarChanged && avatarFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('image', avatarFile)
        const avatar = await uploadAvatar(formDataUpload).unwrap()
        avatarUrl = avatar?.imageUrl
        toast.success('Cập nhật ảnh đại diện thành công!')
      }
      // Update user profile
      const updateData = {
        ...formData,
        avatar: avatarUrl || formData?.avatar,
        dateOfBirth: formData.dateOfBirth === '' ? null : formData.dateOfBirth,
      }
      await updateUser(updateData)
      setIsEditing(false)
      setIsAvatarChanged(false)
      setAvatarFile(null)

      toast.update(toastId, {
        render: 'Cập nhật thông tin thành công!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      })
    } catch (err) {
      toast.update(toastId, {
        render: `Cập nhật thất bại: ${err.message || 'Đã xảy ra lỗi'}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setFormData(initialFormData)
    setAvatarPreview(user?.avatar || DEFAULT_AVATAR)
    setIsAvatarChanged(false)
    setAvatarFile(null)
    setErrors({})
    toast.info('Đã hủy các thay đổi')
  }

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(initialFormData)
      setAvatarPreview(user.avatar || DEFAULT_AVATAR)
    }
  }, [user, initialFormData])

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Loader2 className='h-8 w-8 animate-spin text-heritage' />
      </div>
    )
  }

  return (
    <div className='w-full lcn-container-x animate-fade-in pt-navbar-mobile sm:pt-navbar'>
      <div className='rounded-xl overflow-hidden'>
        {/* Header */}
        <div className='relative bg-gradient-to-r from-heritage-light to-accent p-6 sm:p-8 flex flex-col sm:flex-row justify-between'>
          <div>
            <Title title='Thông tin cá nhân' />
            <p className='text-muted-foreground mt-2'>Quản lý thông tin cá nhân của bạn</p>
          </div>
          <div className='mt-4 sm:mt-0'>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
            )}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='p-6 sm:p-8 space-y-8'>
          {/* Avatar */}
          <div className='flex flex-col sm:flex-row items-center gap-6 pb-6 border-b'>
            <div className='relative group'>
              <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-sm'>
                <img
                  src={avatarPreview || DEFAULT_AVATAR}
                  alt={formData.displayname || 'User'}
                  loading='lazy'
                  className='w-full h-full object-cover'
                />
              </div>
              {isEditing && (
                <label
                  htmlFor='avatar-upload'
                  className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                >
                  <Camera size={32} className='text-white' />
                  <input
                    id='avatar-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleAvatarChange}
                    aria-label='Tải lên ảnh đại diện'
                  />
                </label>
              )}
              {isAvatarChanged && isEditing && (
                <div className='absolute -top-2 -right-2 bg-heritage text-white rounded-full w-6 h-6 flex items-center justify-center'>
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className='text-xl font-semibold'>{user.displayname || 'User'}</h3>
          </div>

          {/* Personal Info */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-heritage-dark'>Thông tin cá nhân</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label htmlFor='displayname' className='block text-sm font-medium text-foreground'>
                  Tên hiển thị
                </label>
                <input
                  type='text'
                  id='displayname'
                  name='displayname'
                  value={formData.displayname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-background border ${errors.displayname ? 'border-destructive' : ''} 
                    rounded-md disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                  placeholder='Nhập tên hiển thị'
                  aria-required='true'
                  aria-invalid={!!errors.displayname}
                  aria-describedby={errors.displayname ? 'displayname-error' : undefined}
                />
                {errors.displayname && (
                  <p id='displayname-error' className='text-sm text-destructive'>
                    {errors.displayname}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <label htmlFor='gender' className='block text-sm font-medium text-foreground'>
                  Giới tính
                </label>
                <select
                  id='gender'
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className='w-full px-3 py-2 bg-background border rounded-md disabled:opacity-70 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
                  aria-label='Chọn giới tính'
                >
                  <option value='other'>Khác</option>
                  <option value='men'>Nam</option>
                  <option value='woman'>Nữ</option>
                </select>
              </div>
              <div className='space-y-2'>
                <label htmlFor='phone' className='block text-sm font-medium text-foreground'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-background border ${errors.phone ? "border-destructive" : "border-input"} rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70 disabled:cursor-not-allowed transition-colors`}
                  placeholder='Nhập số điện thoại'
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id='phone-error' className='text-sm text-destructive'>
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <label htmlFor='dateOfBirth' className='block text-sm font-medium text-foreground'>
                  Ngày sinh
                </label>
                <input
                  type='date'
                  id='dateOfBirth'
                  name='dateOfBirth'
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  aria-label='Chọn ngày sinh'
                  className='w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring
                    disabled:opacity-70 disabled:cursor-not-allowed transition-colors'
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className='flex justify-end gap-4 pt-4 border-t border-border'>
              <Button type='button' onClick={handleCancel} variant='outline' className='flex items-center gap-2'>
                <X size={16} />
                <span>Hủy bỏ</span>
              </Button>
              <Button
                type='submit'
                disabled={isUpdating || isUploadingAvatar}
                className='flex items-center gap-2'
              >
                {(isUpdating || isUploadingAvatar) ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default UserProfile