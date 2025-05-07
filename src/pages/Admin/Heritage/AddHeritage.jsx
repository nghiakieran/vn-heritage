import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/common/ui/Button'
import { Label } from '~/components/common/ui/Label'
import { Input } from '~/components/common/ui/Input'
import { toast } from 'react-toastify'
import HeritageMapView from '~/pages/GoogleMapHeritage/HeritageMapView'
import { useCreateHeritageMutation, useUploadHeritageImgMutation } from '~/store/apis/heritageApi'

const DEFAULT_CENTER = { lat: 16.047079, lng: 108.206230 }; // Da Nang, Vietnam

const AddHeritage = () => {
    const navigate = useNavigate()
    const [createHeritage, { isLoading: isCreating, isSuccess: createSuccess, isError: createError, error: createErrorMessage }] = useCreateHeritageMutation()
    const [uploadHeritageImg] = useUploadHeritageImgMutation()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        images: [],
        coordinates: { latitude: '', longitude: '' },
        status: 'ACTIVE',
        additionalInfo: { historicalEvents: [] },
    })
    const [imagePreviews, setImagePreviews] = useState([])
    const [imageFiles, setImageFiles] = useState([])
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (createSuccess) {
            toast.success('Tạo di tích thành công!')
            navigate('/admin/heritages')
        }
        if (createError) {
            console.error('Lỗi tạo di tích:', createErrorMessage)
            const errorMsg = createErrorMessage?.data?.message || createErrorMessage?.error || 'Lỗi không xác định'
            toast.error(`Tạo di tích thất bại: ${errorMsg}`)
        }
    }, [createSuccess, createError, createErrorMessage, navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('coordinates.')) {
            const field = name.split('.')[1]
            setFormData({
                ...formData,
                coordinates: { ...formData.coordinates, [field]: value },
            })
        } else if (name.startsWith('additionalInfo.historicalEvents')) {
            const [_, __, index, field] = name.split('.')
            const updatedEvents = [...formData.additionalInfo.historicalEvents]
            updatedEvents[index] = {
                ...updatedEvents[index],
                [field]: value,
            }
            setFormData({
                ...formData,
                additionalInfo: {
                    ...formData.additionalInfo,
                    historicalEvents: updatedEvents,
                },
            })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleImageChange = (e) => {
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
                setImagePreviews(prev => [...prev, dataUrl])
                setImageFiles(prev => [...prev, file])
                toast.info('Ảnh đã được thêm, bạn có thể thêm ảnh khác', {
                    position: "top-right"
                })
            }
            reader.onerror = () => {
                toast.error('Không thể đọc file ảnh')
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        toast.info('Đã xóa ảnh')
    }

    const addHistoricalEvent = () => {
        setFormData({
            ...formData,
            additionalInfo: {
                ...formData.additionalInfo,
                historicalEvents: [...formData.additionalInfo.historicalEvents, { title: '', description: '' }],
            },
        })
    }

    const removeHistoricalEvent = (index) => {
        setFormData({
            ...formData,
            additionalInfo: {
                ...formData.additionalInfo,
                historicalEvents: formData.additionalInfo.historicalEvents.filter((_, i) => i !== index),
            },
        })
    }

    const handleSelectCoordinates = useCallback((coordinates) => {
        if (coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number') {
            setFormData(prev => ({
                ...prev,
                coordinates: {
                    latitude: coordinates.lat.toString(),
                    longitude: coordinates.lng.toString(),
                },
            }))
            // Fetch address to update location
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?access_token=pk.eyJ1IjoibmFtbGUwMjIwMDQiLCJhIjoiY205ejlmYm94MHI1djJqb2w5czloNDdrbyJ9.-P_PHQN7L283Z_qIGfgsOg&country=vn`)
                .then(response => response.json())
                .then(data => {
                    const address = data.features?.[0]?.place_name || 'Không tìm thấy địa chỉ'
                    setFormData(prev => ({ ...prev, location: address }))
                })
                .catch(error => {
                    console.error('Error fetching address:', error)
                    setFormData(prev => ({ ...prev, location: 'Lỗi khi lấy địa chỉ' }))
                })
        }
    }, [])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Tên di tích không được để trống'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống'
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Địa điểm không được để trống'
        }
        if (!formData.coordinates.latitude || !formData.coordinates.longitude) {
            newErrors.coordinates = 'Tọa độ không được để trống'
        }
        if (imageFiles.length === 0) {
            newErrors.images = 'Vui lòng chọn ít nhất một hình ảnh'
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

    const handleCreate = async () => {
        if (!validateForm()) return

        try {
            const imageUrls = []
            for (const file of imageFiles) {
                const formDataUpload = new FormData()
                formDataUpload.append('image', file)
                const uploadedImage = await uploadHeritageImg(formDataUpload).unwrap()
                if (uploadedImage?.imageUrl) {
                    imageUrls.push(uploadedImage.imageUrl)
                }
            }

            const heritageData = {
                ...formData,
                images: imageUrls,
            }

            await createHeritage(heritageData).unwrap()
        } catch (err) {
            toast.error(`Tạo di tích thất bại: ${err?.data?.message || err.message || 'Đã xảy ra lỗi'}`)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Thêm Di tích Lịch sử</h2>
            <div className="bg-white p-6 rounded-md shadow-md">
                <div className="mb-6">
                    <Label>Chọn địa điểm trên bản đồ</Label>
                    <div className="w-full h-[400px]">
                        <HeritageMapView
                            center={DEFAULT_CENTER}
                            markers={[]}
                            onSelectCoordinates={handleSelectCoordinates}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name">Tên di tích</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="location">Địa điểm</Label>
                        <Input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={errors.location ? 'border-red-500' : ''}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="images">Hình ảnh</Label>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Input
                                    type="file"
                                    id="images"
                                    name="images"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleImageChange}
                                    className={errors.images ? 'border-red-500' : ''}
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('images').click()}
                                >
                                    Chọn ảnh
                                </Button>
                            </div>
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Image Preview ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded"
                                            />
                                            <Button
                                                variant="outline"
                                                className="absolute top-1 right-1 text-red-500 border-red-500 hover:bg-red-50"
                                                onClick={() => removeImage(index)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="coordinates.latitude">Vĩ độ</Label>
                        <Input
                            type="text"
                            id="coordinates.latitude"
                            name="coordinates.latitude"
                            value={formData.coordinates.latitude}
                            onChange={handleInputChange}
                            className={errors.coordinates ? 'border-red-500' : ''}
                        />
                        {errors.coordinates && <p className="text-red-500 text-sm mt-1">{errors.coordinates}</p>}
                    </div>
                    <div>
                        <Label htmlFor="coordinates.longitude">Kinh độ</Label>
                        <Input
                            type="text"
                            id="coordinates.longitude"
                            name="coordinates.longitude"
                            value={formData.coordinates.longitude}
                            onChange={handleInputChange}
                            className={errors.coordinates ? 'border-red-500' : ''}
                        />
                    </div>
                    <div>
                        <Label htmlFor="status">Trạng thái</Label>
                        <select
                            id="status"
                            name="status"
                            className="w-full p-2 border rounded"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Không hoạt động</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <textarea
                            id="description"
                            name="description"
                            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                            rows="4"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                </div>
                <div className="mt-6">
                    <Label>Sự kiện lịch sử</Label>
                    {formData.additionalInfo.historicalEvents.map((event, index) => (
                        <div key={index} className="mt-4 p-4 border rounded">
                            <div className="mb-2">
                                <Label htmlFor={`additionalInfo.historicalEvents.${index}.title`}>Tiêu đề sự kiện</Label>
                                <Input
                                    type="text"
                                    id={`additionalInfo.historicalEvents.${index}.title`}
                                    name={`additionalInfo.historicalEvents.${index}.title`}
                                    value={event.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor={`additionalInfo.historicalEvents.${index}.description`}>Mô tả sự kiện</Label>
                                <textarea
                                    id={`additionalInfo.historicalEvents.${index}.description`}
                                    name={`additionalInfo.historicalEvents.${index}.description`}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                    value={event.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => removeHistoricalEvent(index)}
                                className="text-red-500 border-red-500 hover:bg-red-50"
                            >
                                Xóa sự kiện
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={addHistoricalEvent}
                        className="mt-4"
                    >
                        + Thêm sự kiện lịch sử
                    </Button>
                </div>
                <div className="mt-6 flex space-x-4">
                    <Button onClick={handleCreate} disabled={isCreating}>
                        {isCreating ? 'Đang tạo...' : 'Tạo'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/heritages')}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddHeritage