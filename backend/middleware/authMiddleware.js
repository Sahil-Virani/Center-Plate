import { auth } from '../config/firebase.js';
import { getUserById } from '../services/userService.js';
import logger from '../logger.js';

/**
 * Middleware to verify Firebase token and ensure user exists in database
 */
export const authenticateFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        
        // Verify Firebase token
        const decodedToken = await auth.verifyIdToken(token);
        const firebaseUid = decodedToken.uid;
        
        // Get user from database
        const user = await getUserById(firebaseUid);
        if (!user) {
            logger.error('User not found in database: %s', firebaseUid);
            return res.status(401).json({ error: 'User not found' });
        }

        // Add user to request
        req.user = user;
        logger.info('User authenticated: %s', user.email);
        next();
    } catch (error) {
        logger.error('Authentication failed: %s', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
}; 