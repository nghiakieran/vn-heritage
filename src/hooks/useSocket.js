import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import socketService, { SOCKET_EVENTS } from '~/api/socket'

/**
 * Hook để quản lý kết nối và tương tác với socket
 * @param {Object} userData - Thông tin người dùng hiện tại (userId, username)
 * @param {string} heritageId - ID của di tích (_id)
 * @returns {Object} - Các phương thức và trạng thái liên quan đến socket
 */
const useSocket = (userData, heritageId) => {
    const [isConnected, setIsConnected] = useState(false)
    const [messages, setMessages] = useState([])
    const [privateMessages, setPrivateMessages] = useState({})
    const [usersInRoom, setUsersInRoom] = useState([])
    const [roomId, setRoomId] = useState(null)
    const [dmRoomIds, setDmRoomIds] = useState({}) // Lưu dmRoomId theo recipientId
    const [socketError, setSocketError] = useState(null)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [hasMoreMessages, setHasMoreMessages] = useState(true)
    const hasJoinedRef = useRef(false)
    const hasFetchedMessagesRef = useRef(false)
    const navigate = useNavigate()
    const limit = 50

    // Kết nối socket
    useEffect(() => {
        if (!userData || !userData.userId) {
            console.log('No userData, skipping socket connect')
            return
        }

        console.log('Connecting socket with userData:', userData)
        socketService.connect(userData)

        const handleConnect = () => {
            console.log('Socket connected')
            setIsConnected(true)
        }

        const handleDisconnect = () => {
            console.log('Socket disconnected')
            setIsConnected(false)
            setUsersInRoom([])
            setRoomId(null)
            setDmRoomIds({})
            setSocketError(null)
            setMessages([])
            setPrivateMessages({})
            setHasMoreMessages(true)
            hasJoinedRef.current = false
            hasFetchedMessagesRef.current = false
        }

        const handleError = (data) => {
            console.error('Socket error:', data)
            setSocketError(data.message)
            if (data.code === 'ROOM_NOT_FOUND') {
                setTimeout(() => {
                    navigate(`/heritage/${heritageId}`)
                }, 3000)
            }
        }

        socketService.on(SOCKET_EVENTS.CONNECT, handleConnect)
        socketService.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect)
        socketService.on('error', handleError)

        return () => {
            console.log('Cleaning up socket connection')
            socketService.off(SOCKET_EVENTS.CONNECT, handleConnect)
            socketService.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect)
            socketService.off('error', handleError)
            if (heritageId) {
                console.log('Emitting leave-room:', { heritageId })
                socketService.leaveRoom({ heritageId, userId: userData.userId })
            }
            socketService.disconnect()
        }
    }, [userData, heritageId, navigate])

    // Đăng ký sự kiện socket
    useEffect(() => {
        const handleRoomJoined = (data) => {
            console.log('Received room-joined:', data)
            setRoomId(data.roomId)
            setSocketError(null)
            const systemMessage = {
                id: `system-${Date.now()}`,
                content: data.message,
                sender: { id: 'system', name: 'Hệ thống' },
                timestamp: new Date().toISOString(),
                isSystemMessage: true,
            }
            setMessages((prev) => {
                if (prev.some(msg => msg.isSystemMessage && msg.content === data.message)) {
                    console.log('Skipping duplicate room-joined message:', data.message)
                    return prev
                }
                console.log('Adding room-joined message:', systemMessage)
                return [...prev, systemMessage]
            })
        }

        const handleUserJoined = (data) => {
            console.log('Received user-joined:', data)
            const systemMessage = {
                id: `system-${Date.now()}`,
                content: `${data.username} vừa tham gia phòng chat.`,
                sender: { id: 'system', name: 'Hệ thống' },
                timestamp: new Date().toISOString(),
                isSystemMessage: true,
            }
            setMessages((prev) => {
                if (prev.some(msg => msg.isSystemMessage && msg.content === systemMessage.content)) {
                    console.log('Skipping duplicate user-joined message:', systemMessage.content)
                    return prev
                }
                console.log('Adding user-joined message:', systemMessage)
                return [...prev, systemMessage]
            })
            setUsersInRoom((prev) => {
                const newUser = { id: data.userId, name: data.username }
                if (!prev.some((user) => user.id === data.userId)) {
                    return [...prev, newUser]
                }
                return prev
            })
        }

        const handleUserLeft = (data) => {
            console.log('Received user-left:', data)
            const systemMessage = {
                id: `system-${Date.now()}`,
                content: `${data.username} đã rời phòng chat.`,
                sender: { id: 'system', name: 'Hệ thống' },
                timestamp: new Date().toISOString(),
                isSystemMessage: true,
            }
            setMessages((prev) => {
                if (prev.some(msg => msg.isSystemMessage && msg.content === systemMessage.content)) {
                    console.log('Skipping duplicate user-left message:', systemMessage.content)
                    return prev
                }
                console.log('Adding user-left message:', systemMessage)
                return [...prev, systemMessage]
            })
            setUsersInRoom((prev) => prev.filter((user) => user.id !== data.userId))
        }

        const handleRoomUsers = (data) => {
            console.log('Received room-users:', data)
            setUsersInRoom(data.users.map((user) => ({
                id: user.userId,
                name: user.username,
            })))
        }

        const handleNewMessage = (data) => {
            console.log('Received new-message:', data)
            const sender = {
                id: data.userId,
                name: usersInRoom.find(user => user.id === data.userId)?.name || 'Unknown',
            }
            const newMessage = {
                id: data._id,
                content: data.content,
                sender: sender,
                timestamp: data.createAt || new Date().toISOString(),
                isCurrentUser: data.userId === userData.userId,
                type: data.type,
                status: data.status,
            }
            setMessages((prev) => {
                if (prev.some(msg => msg.id === newMessage.id)) {
                    console.log('Skipping duplicate message:', newMessage.id)
                    return prev
                }
                console.log('Adding new message:', newMessage)
                return [...prev, newMessage]
            })
        }

        const handleRoomMessages = (data) => {
            console.log('Received room-messages:', data)
            const newMessages = data.messages.map((msg) => {
                const sender = {
                    id: msg.userId,
                    name: usersInRoom.find(user => user.id === msg.userId)?.name || 'Unknown',
                }
                return {
                    id: msg._id,
                    content: msg.content,
                    sender: sender,
                    timestamp: msg.createAt,
                    isCurrentUser: msg.userId === userData.userId,
                    type: msg.type,
                    status: msg.status,
                }
            })
            setMessages((prev) => {
                const uniqueMessages = newMessages.filter(
                    (msg) => !prev.some((existing) => existing.id === msg.id)
                )
                console.log('Adding room messages:', uniqueMessages)
                setHasMoreMessages(uniqueMessages.length === limit)
                setIsLoadingMessages(false)
                return [...uniqueMessages, ...prev]
            })
        }

        const handleJoinDm = (data) => {
            console.log('Received join-dm:', data)
            const { dmRoomId } = data
            // Lưu dmRoomId theo recipientId
            setDmRoomIds((prev) => ({
                ...prev,
                [data.recipientId || userData.userId]: dmRoomId, // Lưu dmRoomId để dùng sau
            }))
            // Lấy lịch sử tin nhắn ngay sau khi tham gia phòng
            socketService.getDirectMessages(dmRoomId, limit)
        }

        const handleNewDm = (data) => {
            console.log('Received new-dm:', data)
            const sender = {
                id: data.userId,
                name: usersInRoom.find(user => user.id === data.userId)?.name || 'Unknown',
            }
            const newMessage = {
                id: data._id,
                content: data.content,
                sender: sender,
                timestamp: data.createAt || new Date().toISOString(),
                isCurrentUser: data.userId === userData.userId,
            }
            const recipientId = data.userId === userData.userId ? data.recipientId : data.userId
            setPrivateMessages((prev) => ({
                ...prev,
                [recipientId]: [...(prev[recipientId] || []), newMessage],
            }))
        }

        const handleDmMessages = (data) => {
            console.log('Received dm-messages:', data)
            const { dmRoomId, messages } = data
            const formattedMessages = messages.map((msg) => ({
                id: msg._id,
                content: msg.content,
                sender: {
                    id: msg.userId,
                    name: usersInRoom.find(user => user.id === msg.userId)?.name || 'Unknown',
                },
                timestamp: msg.createAt || new Date().toISOString(),
                isCurrentUser: msg.userId === userData.userId,
            }))
            // Tìm recipientId tương ứng với dmRoomId
            const recipientId = Object.keys(dmRoomIds).find(
                (key) => dmRoomIds[key] === dmRoomId
            )
            if (recipientId) {
                setPrivateMessages((prev) => ({
                    ...prev,
                    [recipientId]: formattedMessages,
                }))
            }
        }

        socketService.on(SOCKET_EVENTS.ROOM_JOINED, handleRoomJoined)
        socketService.on(SOCKET_EVENTS.USER_JOINED, handleUserJoined)
        socketService.on(SOCKET_EVENTS.USER_LEFT, handleUserLeft)
        socketService.on(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers)
        socketService.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
        socketService.on(SOCKET_EVENTS.ROOM_MESSAGES, handleRoomMessages)
        socketService.on(SOCKET_EVENTS.JOIN_DM_SUCCESS, handleJoinDm)
        socketService.on(SOCKET_EVENTS.NEW_DM, handleNewDm)
        socketService.on(SOCKET_EVENTS.DM_MESSAGES, handleDmMessages)

        return () => {
            console.log('Cleaning up socket events')
            socketService.off(SOCKET_EVENTS.ROOM_JOINED, handleRoomJoined)
            socketService.off(SOCKET_EVENTS.USER_JOINED, handleUserJoined)
            socketService.off(SOCKET_EVENTS.USER_LEFT, handleUserLeft)
            socketService.off(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers)
            socketService.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
            socketService.off(SOCKET_EVENTS.ROOM_MESSAGES, handleRoomMessages)
            socketService.off(SOCKET_EVENTS.JOIN_DM_SUCCESS, handleJoinDm)
            socketService.off(SOCKET_EVENTS.NEW_DM, handleNewDm)
            socketService.off(SOCKET_EVENTS.DM_MESSAGES, handleDmMessages)
        }
    }, [userData, usersInRoom, dmRoomIds])

    // Tham gia phòng cộng đồng
    useEffect(() => {
        if (!isConnected || !heritageId || !userData || hasJoinedRef.current) {
            console.log('Skipping joinRoom:', { isConnected, heritageId, userData, hasJoined: hasJoinedRef.current })
            return
        }

        console.log('Emitting join-room:', { heritageId, userData })
        socketService.joinRoom(heritageId, userData)
        hasJoinedRef.current = true
    }, [isConnected, heritageId, userData])

    // Lấy tin nhắn lần đầu khi có roomId (cho cộng đồng)
    useEffect(() => {
        if (roomId && !hasFetchedMessagesRef.current) {
            console.log('Fetching initial messages for roomId:', roomId)
            setIsLoadingMessages(true)
            socketService.getMessages(roomId, limit)
            hasFetchedMessagesRef.current = true
        }
    }, [roomId])

    // Tải thêm tin nhắn khi kéo lên (cho cộng đồng)
    const loadMoreMessages = useCallback(() => {
        if (!roomId || isLoadingMessages || !hasMoreMessages) {
            console.log('Cannot load more messages:', { roomId, isLoadingMessages, hasMoreMessages })
            return
        }
        const lastMessageTimestamp = messages.length > 0 ? messages[0].timestamp : null
        console.log('Loading more messages:', { roomId, limit, lastMessageTimestamp })
        setIsLoadingMessages(true)
        socketService.getMessages(roomId, limit, lastMessageTimestamp)
    }, [roomId, messages, isLoadingMessages, hasMoreMessages])

    // Gửi tin nhắn cộng đồng
    const sendMessage = useCallback((content) => {
        if (!isConnected || !roomId) {
            console.log('Cannot send message:', { isConnected, roomId })
            return
        }

        const messageData = {
            content,
            type: 'TEXT',
            userId: userData.userId,
        }

        console.log('Sending message:', messageData)
        socketService.sendMessage(roomId, messageData)
    }, [isConnected, roomId])

    // Tham gia phòng chat riêng
    const joinDirectRoom = useCallback((recipientId) => {
        if (!isConnected || !userData) {
            console.log('Cannot join direct room:', { isConnected, userData })
            return
        }

        console.log('Joining direct room with:', { userId1: userData.userId, userId2: recipientId })
        socketService.joinDirectRoom(userData.userId, recipientId, userData)

        // Lưu recipientId để ánh xạ sau
        setDmRoomIds((prev) => ({
            ...prev,
            [recipientId]: prev[recipientId] || null,
        }))
    }, [isConnected, userData])

    // Gửi tin nhắn riêng
    const sendDirectMessage = useCallback((recipientId, content) => {
        if (!isConnected) {
            console.log('Cannot send direct message: not connected')
            return
        }

        const dmRoomId = dmRoomIds[recipientId]
        if (!dmRoomId) {
            console.log('Cannot send direct message: dmRoomId not found for recipient', recipientId)
            return
        }

        const messageData = {
            content,
            type: 'TEXT',
        }

        console.log('Sending direct message:', { dmRoomId, userId: userData.userId, message: messageData })
        socketService.sendDirectMessage(dmRoomId, userData.userId, messageData)

        // Thêm tin nhắn vào state ngay lập tức
        const newMessage = {
            id: `temp-${Date.now()}`,
            content,
            sender: { id: userData.userId, name: userData.username },
            timestamp: new Date().toISOString(),
            isCurrentUser: true,
        }
        setPrivateMessages((prev) => ({
            ...prev,
            [recipientId]: [...(prev[recipientId] || []), newMessage],
        }))
    }, [isConnected, userData, dmRoomIds])

    return {
        isConnected,
        messages,
        privateMessages,
        usersInRoom,
        sendMessage,
        joinDirectRoom,
        sendDirectMessage,
        roomId,
        socketError,
        isLoadingMessages,
        hasMoreMessages,
        loadMoreMessages,
        typingUsers: [],
        handleTyping: () => { },
    }
}

export default useSocket