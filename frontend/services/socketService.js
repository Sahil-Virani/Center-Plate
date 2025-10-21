import { io } from 'socket.io-client'

class SocketService {
    constructor() {
        this.socket = null;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.eventHandlers = new Map();
    }

    connect(token) {
        if (this.socket?.connected) return;

        this.socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    on(event, callback) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        // Store the callback in our event handlers map
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(callback);

        // Attach the event listener to the socket
        this.socket.on(event, (data) => {
            console.log(`Received ${event} event:`, data);
            callback(data);
        });
    }

    off(event, callback) {
        if (!this.socket) return;

        // Remove the callback from our event handlers map
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).delete(callback);
        }

        // Remove the event listener from the socket
        this.socket.off(event, callback);
    }

    joinRoom(roomId) {
        if (this.socket?.connected) {
            console.log('Joining room:', roomId);
            this.socket.emit('joinRoom', roomId);
        }
    }

    leaveRoom(roomId) {
        if (this.socket?.connected) {
            console.log('Leaving room:', roomId);
            this.socket.emit('leaveRoom', roomId);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.eventHandlers.clear();
    }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService; 