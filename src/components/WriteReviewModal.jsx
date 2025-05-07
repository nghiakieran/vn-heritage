import { useState } from 'react'
import { Star, X, Loader2, Check } from 'lucide-react'
import { Button } from '~/components/common/ui/Button'
import { Textarea } from '~/components/common/ui/Textarea'
import { useCreateNewMutation } from '~/store/apis/commentApi'
import { toast } from 'react-toastify'

const WriteReviewModal = ({ heritageId, onClose }) => {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [images, setImages] = useState([]) // Store multiple image files
  const [errors, setErrors] = useState({})

  const [createNew, { isLoading: isSubmitting }] = useCreateNewMutation()

  const handleRating = (value) => {
    setRating(value)
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: null }))
    }
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: null }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff']
    const maxSize = 1 * 1024 * 1024 // 1MB

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`File ${file.name} không hợp lệ. Chỉ chấp nhận JPEG, PNG, GIF, WEBP, BMP, TIFF.`)
        return false
      }
      if (file.size > maxSize) {
        toast.error(`File ${file.name} vượt quá kích thước 1MB.`)
        return false
      }
      return true
    })

    setImages((prevImages) => [...prevImages, ...validFiles].slice(0, 5)) // Limit to 5 images
  }

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}

    if (rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá'
    }

    if (!content.trim()) {
      newErrors.content = 'Nội dung đánh giá không được để trống'
    } else if (content.length < 10) {
      newErrors.content = 'Nội dung đánh giá phải có ít nhất 10 ký tự'
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const formData = new FormData()
      formData.append('heritageId', heritageId)
      formData.append('rating', rating)
      formData.append('content', content)
      images.forEach((image) => formData.append('images', image))

      const newComment = await createNew(formData).unwrap()
      
      toast.success('Đánh giá đã được gửi thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      onClose()
    } catch (err) {
      toast.error(`Gửi đánh giá thất bại: ${err?.data?.message || err.message || 'Đã xảy ra lỗi'}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="lcn-heritage-detail-title mb-4">Viết đánh giá</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm mb-2">Đánh giá của bạn</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
            {errors.rating && (
              <p id="rating-error" className="text-sm text-destructive mt-1">
                {errors.rating}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Textarea
              id="content"
              placeholder="Viết đánh giá của bạn..."
              value={content}
              onChange={handleContentChange}
              className={`h-24 resize-none border-heritage-light focus:ring-heritage-dark ${errors.content ? 'border-destructive' : ''}`}
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? 'content-error' : undefined}
            />
            {errors.content && (
              <p id="content-error" className="text-sm text-destructive mt-1">
                {errors.content}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Tải ảnh lên (tùy chọn, tối đa 5 ảnh)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="border border-heritage-light rounded p-2 w-full text-sm"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-heritage-dark text-heritage-dark"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-heritage-dark text-white hover:bg-heritage-dark/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Gửi đánh giá
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteReviewModal