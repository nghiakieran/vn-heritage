import { io } from 'socket.io-client'

// Địa chỉ máy chủ socket
const SOCKET_SERVER_URL = 'http://localhost:8017'

// Các sự kiện socket
export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    ROOM_JOINED: 'room-joined',
    USER_JOINED: 'user-joined',
    USER_LEFT: 'user-left',
    ROOM_USERS: 'room-users',
    NEW_MESSAGE: 'new-message',
    TYPING: 'typing',
    USER_TYPING: 'user-typing',
    ROOM_MESSAGES: 'room-messages',
}

/**
 * Singleton class để quản lý kết nối socket
 */
class SocketService {
    constructor() {
        this.socket = null
        this.isConnected = false
        this.activeRooms = new Set()
    }

    connect(userData) {
        if (this.socket) return this.socket

        this.socket = io(SOCKET_SERVER_URL, {
            query: {
                userId: userData.userId,
                userName: userData.username,
            },
            autoConnect: true,
            reconnection: true,
        })

        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('Socket connected')
            this.isConnected = true
        })

        this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log('Socket disconnected')
            this.isConnected = false
            this.activeRooms.clear()
        })

        this.socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        return this.socket
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.isConnected = false
            this.activeRooms.clear()
        }
    }

    joinRoom(heritageId, userData) {
        if (!this.socket || !this.isConnected || this.activeRooms.has(heritageId)) return

        const user = {
            userId: userData.userId,
            username: userData.username,
        }

        console.log('Emitting join-room:', { heritageId, userData: user })
        this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, { heritageId, userData: user })
        this.activeRooms.add(heritageId)
    }

    leaveRoom({ heritageId, userId }) {
        if (!this.socket || !this.isConnected) return
        console.log('Emitting leave-room:', { heritageId, userId })
        this.socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { heritageId, userId })
        this.activeRooms.delete(heritageId)
    }

    sendMessage(roomId, message) {
        if (!this.socket || !this.isConnected) return
        this.socket.emit(SOCKET_EVENTS.NEW_MESSAGE, { roomId, message })
    }

    startTyping(roomId) {
        if (!this.socket || !this.isConnected) return
        this.socket.emit(SOCKET_EVENTS.TYPING, { roomId, isTyping: true })
    }

    stopTyping(roomId) {
        if (!this.socket || !this.isConnected) return
        this.socket.emit(SOCKET_EVENTS.TYPING, { roomId, isTyping: false })
    }

    getMessages(roomId, limit = 50, lastMessageTimestamp = null) {
        if (!this.socket || !this.isConnected) return
        console.log('Fetching messages:', { roomId, limit, lastMessageTimestamp })
        this.socket.emit('get-messages', { roomId, limit, lastMessageTimestamp })
    }

    on(event, callback) {
        if (!this.socket) return
        this.socket.on(event, (data) => {
            console.log(`Received ${event}:`, data)
            callback(data)
        })
    }

    off(event, callback) {
        if (!this.socket) return
        this.socket.off(event, callback)
    }
}

// Singleton instance
const socketService = new SocketService()
export default socketService