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
    JOIN_DM: 'join-dm',
    JOIN_DM_SUCCESS: 'join-dm',
    SEND_DM: 'send-dm',
    NEW_DM: 'new-dm',
    GET_DM_MESSAGES: 'get-dm-messages',
    DM_MESSAGES: 'dm-messages',
}

/**
 * Singleton class để quản lý kết nối socket
 */
class SocketService {
    constructor() {
        this.socket = null
        this.isConnected = false
        this.activeRooms = new Set()
        this.activeDirectRooms = new Set()
    }

    connect(userData) {
        if (this.socket && this.isConnected) {
            console.log('Socket already connected, returning existing socket')
            return this.socket
        }

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
            this.activeDirectRooms.clear()
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
            this.activeDirectRooms.clear()
        }
    }

    joinRoom(heritageId, userData) {
        if (!this.socket || !this.isConnected || this.activeRooms.has(heritageId)) {
            console.log('Cannot join room:', { socket: !!this.socket, isConnected: this.isConnected, alreadyJoined: this.activeRooms.has(heritageId) })
            return
        }

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

    joinDirectRoom(userId1, userId2, userData) {
        if (!this.socket || !this.isConnected) {
            console.log('Cannot join direct room:', { socket: !!this.socket, isConnected: this.isConnected })
            return
        }

        const roomKey = [userId1, userId2].sort().join('-')
        if (this.activeDirectRooms.has(roomKey)) {
            console.log(`Already joined direct room ${roomKey}, skipping`)
            return
        }

        console.log('Emitting join-dm:', { userId1, userId2, userData })
        this.socket.emit(SOCKET_EVENTS.JOIN_DM, { userId1, userId2, userData })
        this.activeDirectRooms.add(roomKey)
    }

    sendMessage(roomId, message) {
        if (!this.socket || !this.isConnected) return
        this.socket.emit(SOCKET_EVENTS.NEW_MESSAGE, { roomId, message })
    }

    sendDirectMessage(dmRoomId, userId, message) {
        if (!this.socket || !this.isConnected) return
        console.log('Emitting send-dm:', { dmRoomId, userId, message })
        this.socket.emit(SOCKET_EVENTS.SEND_DM, { dmRoomId, userId, message })
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

    getDirectMessages(dmRoomId, limit = 50) {
        if (!this.socket || !this.isConnected) return
        console.log('Fetching DM messages:', { dmRoomId, limit })
        this.socket.emit(SOCKET_EVENTS.GET_DM_MESSAGES, { dmRoomId, limit })
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