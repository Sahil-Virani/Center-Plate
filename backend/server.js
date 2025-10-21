import express from 'express'
import dotenv from 'dotenv';
import http from 'http'
import morgan from 'morgan';
import { Server } from 'socket.io';
import { connectDB } from './db/mongooseConnection.js';
import configRoutes from './routes/index.js';
import configSocket from './socket/index.js'
import logger from './logger.js';
import { corsOptions, securityHeaders, apiLimiter } from './middleware/security.js';
import helmet from 'helmet';
import cors from 'cors';
dotenv.config();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet(securityHeaders));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Request logging
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Create Socket.IO instance with proper CORS configuration
const io = new Server(server, {
    cors: {
        origin: true, // Allow all origins for React Native
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    },
    pingTimeout: 60000, // Increase ping timeout for mobile devices
    pingInterval: 25000, // Adjust ping interval
    transports: ['websocket', 'polling'] // Support both WebSocket and polling
});

// Add io instance to request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket configuration
configSocket(io);

// Routes
configRoutes(app);

// Database connection and server startup
await connectDB();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    logger.info("We've now got a server!");
    logger.info(`Your routes will be running on http://localhost:${PORT}`);
    logger.info(`Socket.IO server is running on ws://localhost:${PORT}`);
});
