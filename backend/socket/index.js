import logger from "../logger.js";
import { auth } from '../config/firebase.js';
import { getUserById } from '../services/userService.js';

const configSocket = (io) => {
    // Middleware for Firebase authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('No token provided'));
            }

            // Verify Firebase token
            const decodedToken = await auth.verifyIdToken(token);
            const firebaseUid = decodedToken.uid;
            
            // Get user from database
            const user = await getUserById(firebaseUid);
            if (!user) {
                logger.error('User not found in database: %s', firebaseUid);
                return next(new Error('User not found'));
            }

            // Add user to socket
            socket.user = user;
            logger.info('Socket authenticated for user: %s', user.email);
            next();
        } catch (error) {
            logger.error('Socket authentication failed: %s', error.message);
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        logger.info('New client connected: %s', socket.id);

        // Handle connection errors
        socket.on('error', (error) => {
            logger.error('Socket error: %s', error.message);
            socket.emit('error', { message: 'An error occurred' });
        });

        socket.on('disconnect', (reason) => {
            logger.info('Client disconnected: %s, reason: %s', socket.id, reason);
        });

        // Room management
        socket.on('joinRoom', (room) => {
            try {
                logger.info('Socket %s joining room %s', socket.id, room);
                socket.join(room);
                socket.emit('joinedRoom', { room, success: true });
            } catch (error) {
                logger.error('Error joining room: %s', error.message);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });
    
        socket.on('leaveRoom', (room) => {
            try {
                logger.info('Socket %s leaving room %s', socket.id, room);
                socket.leave(room);
                socket.emit('leftRoom', { room, success: true });
            } catch (error) {
                logger.error('Error leaving room: %s', error.message);
                socket.emit('error', { message: 'Failed to leave room' });
            }
        });
    });
};

export default configSocket;
