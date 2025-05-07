import { useState, useEffect, useRef } from 'react'
import { Button } from '~/components/common/ui/Button'
import { Input } from '~/components/common/ui/Input'
import { Loader2, Paperclip, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import {
    useGetApiResponseMutation,
    useGetChatHistoryQuery,
    useUploadDocumentMutation,
    useUploadJsonMutation, // Added for landmark data
} from '~/store/apis/chatSlice' // Fixed import from chatSlice to chatApi

const HeritageChat = ({ heritageId, heritageName, landmarkData }) => {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [sessionId, setSessionId] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isLandmarkUploaded, setIsLandmarkUploaded] = useState(false)
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    const selectedModel = 'gemini-1.5-flash'

    const { data: history, isLoading: isHistoryLoading } = useGetChatHistoryQuery(sessionId, {
        skip: !sessionId,
    })

    const [getApiResponse] = useGetApiResponseMutation()
    const [uploadDocument] = useUploadDocumentMutation()
    const [uploadJson] = useUploadJsonMutation() // Added for landmark data

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (history && Array.isArray(history)) {
            setMessages(
                history.map((item) => ({
                    id: Date.now() + Math.random(),
                    sender: item.role === 'user' ? 'user' : 'ai',
                    content: item.content,
                    timestamp: new Date().toLocaleTimeString('vi-VN'),
                }))
            )
        }
    }, [history])

    useEffect(() => {
        const sendLandmarkData = async () => {
            if (isLandmarkUploaded || !landmarkData) return
            try {
                console.log('Sending landmark data to /upload-landmark-info:', landmarkData)
                const result = await uploadJson(landmarkData).unwrap()
                console.log('Upload landmark response:', result)
                setIsLandmarkUploaded(true)
                const initMessage = {
                    id: Date.now(),
                    sender: 'ai',
                    content: `Đã tải thông tin về di tích ${heritageName}. Hỏi tôi bất cứ điều gì!`,
                    timestamp: new Date().toLocaleTimeString('vi-VN'),
                }
                setMessages([initMessage])
                toast.success('Đã tải thông tin di tích!')
            } catch (error) {
                console.error('Upload Landmark Error:', error)
                toast.error(`Lỗi khi tải thông tin di tích: ${error.data?.detail || error.message}`)
            }
        }

        sendLandmarkData()
    }, [heritageName, uploadJson, isLandmarkUploaded, landmarkData])

    const handleSendMessage = async () => {
        if (!inputText.trim()) {
            toast.error('Vui lòng nhập tin nhắn!')
            return
        }

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            content: inputText,
            timestamp: new Date().toLocaleTimeString('vi-VN'),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputText('')

        try {
            const context = `Dựa trên thông tin di tích ${heritageName} (ID: ${heritageId}): ${JSON.stringify(landmarkData, null, 2)}\nCâu hỏi: ${inputText}`
            const response = await getApiResponse({
                question: context,
                sessionId,
                model: selectedModel,
            }).unwrap()

            const aiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                content: response.response || 'AI: Đã nhận câu hỏi.',
                timestamp: new Date().toLocaleTimeString('vi-VN'),
            }

            setMessages((prev) => [...prev, aiMessage])
            if (response.session_id && !sessionId) {
                setSessionId(response.session_id)
            }
        } catch (error) {
            toast.error('Lỗi khi nhận phản hồi từ AI!')
            console.error('API Error:', error)
        }
    }

    const handleFileUpload = async (event) => {
        const files = event.target.files
        if (!files.length) return

        const maxSize = 10 * 1024 * 1024
        for (const file of files) {
            if (file.size > maxSize) {
                toast.error(`Tệp ${file.name} vượt quá 10MB!`)
                continue
            }

            setIsUploading(true)
            try {
                const result = await uploadDocument(file).unwrap()
                const fileMessage = {
                    id: Date.now(),
                    sender: 'user',
                    file: {
                        name: file.name,
                        url: result.file_id ? `/files/${result.file_id}` : URL.createObjectURL(file),
                        type: file.type,
                    },
                    timestamp: new Date().toLocaleTimeString('vi-VN'),
                }

                setMessages((prev) => [...prev, fileMessage])
                toast.success(`Đã tải lên ${file.name}!`)

                const context = `Người dùng đã tải lên tệp ${file.name} liên quan đến di tích ${heritageName}. Dựa trên thông tin di tích: ${JSON.stringify(landmarkData, null, 2)}.`
                const response = await getApiResponse({
                    question: context,
                    sessionId,
                    model: selectedModel,
                }).unwrap()

                const aiMessage = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    content: response.response || `AI: Đã nhận tệp ${file.name}.`,
                    timestamp: new Date().toLocaleTimeString('vi-VN'),
                }

                setMessages((prev) => [...prev, aiMessage])
                if (response.session_id && !sessionId) {
                    setSessionId(response.session_id)
                }
            } catch (error) {
                toast.error(`Tải lên ${file.name} thất bại!`)
                console.error('Upload Error:', error)
            } finally {
                setIsUploading(false)
            }
        }

        fileInputRef.current.value = ''
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-[400px] w-[300px] bg-white rounded-lg shadow-lg">
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {isHistoryLoading ? (
                    <div className="text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">Đang tải nội dung...</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-2 rounded-lg text-sm ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                    }`}
                            >
                                {message.content && <p>{message.content}</p>}
                                {message.file && (
                                    <div>
                                        {message.file.type.startsWith('image/') ? (
                                            <img
                                                src={message.file.url}
                                                alt={message.file.name}
                                                className="max-w-[150px] rounded"
                                            />
                                        ) : (
                                            <a
                                                href={message.file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                {message.file.name}
                                            </a>
                                        )}
                                    </div>
                                )}
                                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center p-3 border-t border-gray-200 gap-2">
                <Button
                    className="p-1"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Paperclip className="w-4 h-4" />
                    )}
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                />
                <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi gì đó..."
                    className="flex-1 text-sm"
                />
                <Button onClick={handleSendMessage} disabled={isUploading} className="p-1">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default HeritageChat
