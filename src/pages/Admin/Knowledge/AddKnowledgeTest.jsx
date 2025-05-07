import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/common/ui/Button'
import { Label } from '~/components/common/ui/Label'
import { Input } from '~/components/common/ui/Input'
import { toast } from 'react-toastify'
import { useCreateKnowledgeTestMutation, useUploadKnowledgeTestImgMutation } from '~/store/apis/knowledgeTestApi'
import { useGetAllHeritageNamesQuery } from '~/store/apis/heritageApi'

const AddKnowledgeTest = () => {
    const navigate = useNavigate()
    const { data: heritageNames, isLoading: isHeritageLoading, error: heritageError } = useGetAllHeritageNamesQuery()
    const [createKnowledgeTest, { isLoading: isCreating, isSuccess: createSuccess, isError: createError, error: createErrorMessage }] = useCreateKnowledgeTestMutation()
    const [uploadKnowledgeTestImg, { isLoading: isUploadingImage }] = useUploadKnowledgeTestImgMutation()
    const [formData, setFormData] = useState({
        heritageId: '',
        title: '',
        content: '',
        questions: [],
        status: 'ACTIVE',
    })
    const [imageFiles, setImageFiles] = useState({})
    const [imagePreviews, setImagePreviews] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (createSuccess) {
            toast.success('Tạo bài kiểm tra thành công!')
            navigate('/admin/knowledge-tests')
        }
        if (createError) {
            console.error('Lỗi tạo bài kiểm tra:', createErrorMessage)
            const errorMsg = createErrorMessage?.data?.message || createErrorMessage?.error || 'Lỗi không xác định'
            toast.error(`Tạo bài kiểm tra thất bại: ${errorMsg}`)
        }
        if (heritageError) {
            toast.error('Không thể tải danh sách di sản')
        }
    }, [createSuccess, createError, createErrorMessage, heritageError, navigate])

    const handleInputChange = (e, questionIndex = null, optionIndex = null) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => {
            if (questionIndex !== null && optionIndex !== null) {
                const questions = [...prev.questions]
                questions[questionIndex].options[optionIndex] = {
                    ...questions[questionIndex].options[optionIndex],
                    [name]: type === 'checkbox' ? checked : value,
                }
                return { ...prev, questions }
            } else if (questionIndex !== null) {
                const questions = [...prev.questions]
                questions[questionIndex] = { ...questions[questionIndex], [name]: value }
                return { ...prev, questions }
            }
            return { ...prev, [name]: value }
        })
    }

    const handleImageChange = (e, questionIndex) => {
        const file = e.target.files[0]
        if (!file) return

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
            setImagePreviews((prev) => ({
                ...prev,
                [questionIndex]: reader.result,
            }))
            setImageFiles((prev) => ({
                ...prev,
                [questionIndex]: file,
            }))
            toast.info('Ảnh đã được chọn', { position: 'top-right' })
        }
        reader.onerror = () => {
            toast.error('Không thể đọc file ảnh')
        }
        reader.readAsDataURL(file)
    }

    const removeImage = (questionIndex) => {
        setFormData((prev) => {
            const questions = [...prev.questions]
            questions[questionIndex] = { ...questions[questionIndex], image: '' }
            return { ...prev, questions }
        })
        setImagePreviews((prev) => {
            const newPreviews = { ...prev }
            delete newPreviews[questionIndex]
            return newPreviews
        })
        setImageFiles((prev) => {
            const newFiles = { ...prev }
            delete newFiles[questionIndex]
            return newFiles
        })
        toast.info('Đã xóa ảnh')
    }

    const addQuestion = () => {
        setFormData((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    content: '',
                    explanation: '',
                    image: '',
                    options: [
                        { optionText: '', isCorrect: false },
                        { optionText: '', isCorrect: false },
                        { optionText: '', isCorrect: false },
                        { optionText: '', isCorrect: false },
                    ],
                },
            ],
        }))
    }

    const removeQuestion = (index) => {
        setFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }))
        setImagePreviews((prev) => {
            const newPreviews = { ...prev }
            delete newPreviews[index]
            return newPreviews
        })
        setImageFiles((prev) => {
            const newFiles = { ...prev }
            delete newFiles[index]
            return newFiles
        })
    }

    const addOption = (questionIndex) => {
        setFormData((prev) => {
            const questions = [...prev.questions]
            questions[questionIndex].options.push({ optionText: '', isCorrect: false })
            return { ...prev, questions }
        })
    }

    const removeOption = (questionIndex, optionIndex) => {
        setFormData((prev) => {
            const questions = [...prev.questions]
            questions[questionIndex].options = questions[questionIndex].options.filter((_, i) => i !== optionIndex)
            return { ...prev, questions }
        })
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.heritageId) {
            newErrors.heritageId = 'Vui lòng chọn một di sản'
        }
        if (!formData.title.trim() || formData.title.length < 3 || formData.title.length > 200) {
            newErrors.title = 'Tiêu đề phải từ 3 đến 200 ký tự'
        }
        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung không được để trống'
        }
        if (formData.questions.length === 0) {
            newErrors.questions = 'Phải có ít nhất một câu hỏi'
        } else {
            formData.questions.forEach((q, i) => {
                if (!q.content.trim()) {
                    newErrors[`question_${i}_content`] = 'Nội dung câu hỏi không được để trống'
                }
                if (q.options.length < 2) {
                    newErrors[`question_${i}_options`] = 'Phải có ít nhất 2 lựa chọn'
                } else {
                    q.options.forEach((o, j) => {
                        if (!o.optionText.trim()) {
                            newErrors[`question_${i}_option_${j}`] = 'Lựa chọn không được để trống'
                        }
                    })
                    if (!q.options.some((o) => o.isCorrect)) {
                        newErrors[`question_${i}_correct`] = 'Phải có ít nhất một lựa chọn đúng'
                    }
                }
            })
        }

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) {
            toast.error('Vui lòng kiểm tra lại thông tin nhập vào')
        }
        return Object.keys(newErrors).length === 0
    }

    const handleCreate = async () => {
        if (!validateForm()) return

        try {
            const questions = await Promise.all(
                formData.questions.map(async (question, index) => {
                    let imageUrl = question.image
                    if (imageFiles[index]) {
                        const formDataUpload = new FormData()
                        formDataUpload.append('image', imageFiles[index])
                        const uploadedImage = await uploadKnowledgeTestImg(formDataUpload).unwrap()
                        imageUrl = uploadedImage?.imageUrl || ''
                    }
                    return { ...question, image: imageUrl }
                })
            )

            const testData = {
                ...formData,
                questions,
            }

            await createKnowledgeTest(testData).unwrap()
        } catch (err) {
            toast.error(`Tạo bài kiểm tra thất bại: ${err?.data?.message || err.message || 'Đã xảy ra lỗi'}`)
        }
    }

    if (isHeritageLoading) {
        return <div className="text-center p-4">Đang tải danh sách di sản...</div>
    }

    if (heritageError) {
        return <div className="text-center text-red-500 p-4">Không thể tải danh sách di sản</div>
    }

    return (
        <div className="space-y-6 mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Thêm Bài Kiểm tra Kiến thức</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="heritageId">Di sản</Label>
                        <select
                            id="heritageId"
                            name="heritageId"
                            className={`mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.heritageId ? 'border-red-500' : ''}`}
                            value={formData.heritageId}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn di sản</option>
                            {heritageNames?.map((heritage) => (
                                <option key={heritage._id} value={heritage._id}>
                                    {heritage.name}
                                </option>
                            ))}
                        </select>
                        {errors.heritageId && <p className="text-red-500 text-sm mt-1">{errors.heritageId}</p>}
                    </div>
                    <div>
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="Nhập tiêu đề bài kiểm tra"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <Label htmlFor="status">Trạng thái</Label>
                        <select
                            id="status"
                            name="status"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Không hoạt động</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="content">Nội dung</Label>
                        <textarea
                            id="content"
                            name="content"
                            className={`mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.content ? 'border-red-500' : ''}`}
                            rows="4"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Nhập nội dung bài kiểm tra"
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                    </div>
                </div>
                <div className="mt-6">
                    <Label className="text-lg font-medium">Câu hỏi</Label>
                    {errors.questions && <p className="text-red-500 text-sm mt-1">{errors.questions}</p>}
                    {formData.questions.map((question, qIndex) => (
                        <div key={qIndex} className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="mb-4">
                                <Label htmlFor={`question_${qIndex}_content`}>Nội dung câu hỏi {qIndex + 1}</Label>
                                <textarea
                                    id={`question_${qIndex}_content`}
                                    name="content"
                                    className={`mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors[`question_${qIndex}_content`] ? 'border-red-500' : ''}`}
                                    rows="3"
                                    value={question.content}
                                    onChange={(e) => handleInputChange(e, qIndex)}
                                    placeholder="Nhập nội dung câu hỏi"
                                />
                                {errors[`question_${qIndex}_content`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}_content`]}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <Label htmlFor={`question_${qIndex}_explanation`}>Giải thích</Label>
                                <textarea
                                    id={`question_${qIndex}_explanation`}
                                    name="explanation"
                                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    value={question.explanation}
                                    onChange={(e) => handleInputChange(e, qIndex)}
                                    placeholder="Nhập giải thích (tùy chọn)"
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor={`question_${qIndex}_image`}>Hình ảnh (tùy chọn)</Label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            id={`question_${qIndex}_image`}
                                            name="image"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={(e) => handleImageChange(e, qIndex)}
                                            className="hidden"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => document.getElementById(`question_${qIndex}_image`).click()}
                                            disabled={isUploadingImage}
                                        >
                                            {isUploadingImage ? 'Đang tải ảnh...' : 'Chọn ảnh'}
                                        </Button>
                                    </div>
                                    {imagePreviews[qIndex] && (
                                        <div className="relative w-32">
                                            <img
                                                src={imagePreviews[qIndex]}
                                                alt={`Câu hỏi ${qIndex + 1}`}
                                                className="w-32 h-32 object-cover rounded-md"
                                            />
                                            <Button
                                                variant="outline"
                                                className="absolute top-1 right-1 text-red-500 border-red-500 hover:bg-red-50"
                                                onClick={() => removeImage(qIndex)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label>Lựa chọn</Label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3 mt-2">
                                        <Input
                                            type="text"
                                            name="optionText"
                                            value={option.optionText}
                                            onChange={(e) => handleInputChange(e, qIndex, oIndex)}
                                            className={`flex-1 ${errors[`question_${qIndex}_option_${oIndex}`] ? 'border-red-500' : ''}`}
                                            placeholder={`Lựa chọn ${oIndex + 1}`}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="isCorrect"
                                                checked={option.isCorrect}
                                                onChange={(e) => handleInputChange(e, qIndex, oIndex)}
                                                className="h-5 w-5 text-blue-600"
                                            />
                                            <Label>Đúng</Label>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="text-red-500 border-red-500 hover:bg-red-50"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                        >
                                            Xóa
                                        </Button>
                                        {errors[`question_${qIndex}_option_${oIndex}`] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}_option_${oIndex}`]}</p>
                                        )}
                                    </div>
                                ))}
                                {errors[`question_${qIndex}_options`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}_options`]}</p>
                                )}
                                {errors[`question_${qIndex}_correct`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}_correct`]}</p>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => addOption(qIndex)}
                                    className="mt-3 text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                    + Thêm lựa chọn
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => removeQuestion(qIndex)}
                            >
                                Xóa câu hỏi
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={addQuestion}
                        className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                        + Thêm câu hỏi
                    </Button>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating || isUploadingImage || isHeritageLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isCreating ? 'Đang tạo...' : 'Tạo bài kiểm tra'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/knowledge-tests')}
                        className="text-gray-600 border-gray-600 hover:bg-gray-100"
                    >
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddKnowledgeTest