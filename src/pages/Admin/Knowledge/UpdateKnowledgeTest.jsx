import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '~/components/common/ui/Button'
import { Label } from '~/components/common/ui/Label'
import { Input } from '~/components/common/ui/Input'
import { toast } from 'react-toastify'
import { useGetKnowledgeTestByIdQuery, useUpdateKnowledgeTestMutation, useUploadKnowledgeTestImgMutation } from '~/store/apis/knowledgeTestApi'

const UpdateKnowledgeTest = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { data: test, isLoading: isFetching, error: fetchError } = useGetKnowledgeTestByIdQuery(id)
    const [updateKnowledgeTest, { isLoading: isUpdating, isSuccess: updateSuccess, isError: updateError, error: updateErrorMessage }] = useUpdateKnowledgeTestMutation()
    const [uploadKnowledgeTestImg] = useUploadKnowledgeTestImgMutation()
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
        if (test) {
            setFormData({
                heritageId: test.heritageId || '',
                title: test.title || '',
                content: test.content || '',
                questions: test.questions.map((q) => ({
                    content: q.content || '',
                    explanation: q.explanation || '',
                    image: q.image || '',
                    options: q.options || [{ optionText: '', isCorrect: false }, { optionText: '', isCorrect: false }],
                })) || [],
                status: test.status || 'ACTIVE',
            })
            const previews = {}
            test.questions.forEach((q, i) => {
                if (q.image) previews[i] = q.image
            })
            setImagePreviews(previews)
        }
        if (fetchError) {
            toast.error('Không thể tải thông tin bài kiểm tra')
        }
    }, [test, fetchError, navigate])

    useEffect(() => {
        if (updateSuccess) {
            toast.success('Cập nhật bài kiểm tra thành công!')
            navigate('/admin/knowledge-tests')
        }
        if (updateError) {
            console.error('Lỗi cập nhật bài kiểm tra:', updateErrorMessage)
            const errorMsg = updateErrorMessage?.data?.message || updateErrorMessage?.error || 'Lỗi không xác định'
            toast.error(`Cập nhật bài kiểm tra thất bại: ${errorMsg}`)
        }
    }, [updateSuccess, updateError, updateErrorMessage, navigate])

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
                setImagePreviews((prev) => ({
                    ...prev,
                    [questionIndex]: reader.result,
                }))
                setImageFiles((prev) => ({
                    ...prev,
                    [questionIndex]: file,
                }))
                setFormData((prev) => {
                    const questions = [...prev.questions]
                    questions[questionIndex] = { ...questions[questionIndex], image: '' } // Clear existing image
                    return { ...prev, questions }
                })
                toast.info('Ảnh đã được thêm', { position: 'top-right' })
            }
            reader.onerror = () => {
                toast.error('Không thể đọc file ảnh')
            }
            reader.readAsDataURL(file)
        }
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
                    options: [{ optionText: '', isCorrect: false }, { optionText: '', isCorrect: false }],
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

        if (!formData.heritageId.match(/^[0-9a-fA-F]{24}$/)) {
            newErrors.heritageId = 'Heritage ID phải là ObjectId hợp lệ'
        }
        if (!formData.title.trim() || formData.title.length < 3 || formData.title.length > 200) {
            newErrors.title = 'Tiêu đề phải từ 3 đến 200 ký tự'
        }
        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung không được để trống'
        }
        if (formData.questions.length > 0) {
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

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            const questions = await Promise.all(
                formData.questions.map(async (question, index) => {
                    let imageUrl = question.image;
                    if (imageFiles[index]) {
                        const formDataUpload = new FormData();
                        formDataUpload.append('image', imageFiles[index]);
                        const uploadedImage = await uploadKnowledgeTestImg(formDataUpload).unwrap();
                        imageUrl = uploadedImage?.imageUrl || '';
                    }
                    return {
                        id: test.questions[index]?.questionId, // Map questionId to id
                        content: question.content,
                        explanation: question.explanation,
                        image: imageUrl,
                        options: question.options.map((option) => ({
                            id: option.optionId, // Map optionId to id
                            optionText: option.optionText,
                            isCorrect: option.isCorrect,
                        })),
                    };
                })
            );

            const testData = {
                heritageId: formData.heritageId,
                title: formData.title,
                content: formData.content,
                questions,
                status: formData.status,
            };
            await updateKnowledgeTest({ testId: id, data: testData }).unwrap();
        } catch (err) {
            toast.error(`Cập nhật bài kiểm tra thất bại: ${err?.data?.message || err.message || 'Đã xảy ra lỗi'}`);
        }
    };


    if (isFetching) {
        return <div className="text-center">Đang tải thông tin bài kiểm tra...</div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Cập nhật Bài Kiểm tra Kiến thức</h2>
            <div className="bg-white p-6 rounded-md shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="heritageId">Heritage ID</Label>
                        <Input
                            type="text"
                            id="heritageId"
                            name="heritageId"
                            value={formData.heritageId}
                            onChange={handleInputChange}
                            className={errors.heritageId ? 'border-red-500' : ''}
                        />
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
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
                        <Label htmlFor="content">Nội dung</Label>
                        <textarea
                            id="content"
                            name="content"
                            className={`w-full p-2 border rounded ${errors.content ? 'border-red-500' : ''}`}
                            rows="4"
                            value={formData.content}
                            onChange={handleInputChange}
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                    </div>
                </div>
                <div className="mt-6">
                    <Label>Câu hỏi</Label>
                    {formData.questions.map((question, qIndex) => (
                        <div key={qIndex} className="mt-4 p-4 border rounded">
                            <div className="mb-2">
                                <Label htmlFor={`question_${qIndex}_content`}>Nội dung câu hỏi</Label>
                                <textarea
                                    id={`question_${qIndex}_content`}
                                    name="content"
                                    className={`w-full p-2 border rounded ${errors[`question_${qIndex}_content`] ? 'border-red-500' : ''}`}
                                    rows="3"
                                    value={question.content}
                                    onChange={(e) => handleInputChange(e, qIndex)}
                                />
                                {errors[`question_${qIndex}_content`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}_content`]}</p>
                                )}
                            </div>
                            <div className="mb-2">
                                <Label htmlFor={`question_${qIndex}_explanation`}>Giải thích</Label>
                                <textarea
                                    id={`question_${qIndex}_explanation`}
                                    name="explanation"
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                    value={question.explanation}
                                    onChange={(e) => handleInputChange(e, qIndex)}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor={`question_${qIndex}_image`}>Hình ảnh</Label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            id={`question_${qIndex}_image`}
                                            name="image"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={(e) => handleImageChange(e, qIndex)}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => document.getElementById(`question_${qIndex}_image`).click()}
                                        >
                                            Chọn ảnh
                                        </Button>
                                    </div>
                                    {imagePreviews[qIndex] && (
                                        <div className="relative w-32">
                                            <img
                                                src={imagePreviews[qIndex]}
                                                alt={`Question ${qIndex + 1}`}
                                                className="w-32 h-32 object-cover rounded"
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
                            <div className="mb-2">
                                <Label>Lựa chọn</Label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2 mt-2">
                                        <Input
                                            type="text"
                                            name="optionText"
                                            value={option.optionText}
                                            onChange={(e) => handleInputChange(e, qIndex, oIndex)}
                                            className={errors[`question_${qIndex}_option_${oIndex}`] ? 'border-red-500' : ''}
                                            placeholder={`Lựa chọn ${oIndex + 1}`}
                                        />
                                        <input
                                            type="checkbox"
                                            name="isCorrect"
                                            checked={option.isCorrect}
                                            onChange={(e) => handleInputChange(e, qIndex, oIndex)}
                                            className="h-5 w-5"
                                        />
                                        <Label>Đúng</Label>
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
                                    className="mt-2"
                                >
                                    + Thêm lựa chọn
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-50 mt-2"
                                onClick={() => removeQuestion(qIndex)}
                            >
                                Xóa câu hỏi
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={addQuestion}
                        className="mt-4"
                    >
                        + Thêm câu hỏi
                    </Button>
                </div>
                <div className="mt-6 flex space-x-4">
                    <Button onClick={handleUpdate} disabled={isUpdating || isFetching}>
                        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/knowledge-tests')}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UpdateKnowledgeTest