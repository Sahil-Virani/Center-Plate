import { auth } from '../config/firebase.js';
import { createUser, updateUser } from '../services/userService.js';
import { connectDB } from '../db/mongooseConnection.js';
import mongoose from 'mongoose';
import logger from '../logger.js';

async function fetchAllFirebaseUsers() {
    let nextPageToken = undefined;
    const allUsers = [];
    try {
        logger.info('Fetching Firebase users...');
        do {
            const result = await auth.listUsers(1000, nextPageToken);
            allUsers.push(...result.users);
            nextPageToken = result.pageToken;
        } while (nextPageToken);
        logger.info(`Fetched ${allUsers.length} users from Firebase`);
        return allUsers;
    } catch (error) {
        throw new Error('Error retrieving Firebase users: ' + error.message);
    }
}

async function syncFirebaseUsers() {
    try {
        // Connect to MongoDB
        logger.info('Connecting to MongoDB...');
        await connectDB();
        
        // Get all users from Firebase with pagination
        const firebaseUsers = await fetchAllFirebaseUsers();
        
        // Create a Set of all Firebase UIDs for deletion later
        const firebaseUids = new Set(firebaseUsers.map(user => user.uid));
        
        logger.info('Synchronizing Firebase users with MongoDB...');
        
        // Process each user
        for (const firebaseUser of firebaseUsers) {
            try {
                const userData = {
                    _id: firebaseUser.uid,
                    username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                    email: firebaseUser.email,
                    preferences: {},
                    locations: [],
                    pushToken: null
                };

                // Try to create or update the user
                try {
                    await createUser(userData);
                    logger.info(`Created new user: ${firebaseUser.uid}`);
                } catch (error) {
                    if (error.message.includes('User already exists')) {
                        await updateUser(firebaseUser.uid, {
                            username: userData.username,
                            email: userData.email
                        });
                        logger.info(`Updated existing user: ${firebaseUser.uid}`);
                    } else {
                        throw error;
                    }
                }
            } catch (error) {
                logger.error(`Error syncing user ${firebaseUser.uid}: ${error.message}`);
            }
        }
        
        // Delete any MongoDB users that are not in Firebase
        const deletionResult = await mongoose.connection.collection('users').deleteMany({
            _id: { $nin: Array.from(firebaseUids) }
        });
        logger.info(`Deleted ${deletionResult.deletedCount} users that are not in Firebase`);
        
        logger.info('Firebase users sync completed');
    } catch (error) {
        logger.error(`Error during Firebase users sync: ${error.message}`);
        process.exit(1);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
        process.exit();
    }
}

// Run the sync
syncFirebaseUsers(); 