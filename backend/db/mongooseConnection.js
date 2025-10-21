import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const BD_NAME = process.env.DB_NAME;


export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: BD_NAME
        });
        logger.info('Connected to the database');
    } catch (error) {
        logger.error('Error connecting to the database: %s', error.message);
    }
};