import { Router } from 'express';
import {
    findOptimalLocationController,
    getPlaceImagesController
} from '../controllers/midpointControllers.js';
import { authenticateFirebaseToken } from '../middleware/authMiddleware.js';
import { midpointValidators } from '../middleware/validators.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateFirebaseToken);

/**
 * @route POST /api/midpoint/find
 * @desc Find optimal meeting location based on participant coordinates and restaurant preferences
 * @access Private
 * @body {Object} Request body
 * @body {number[][]} coordinates - Array of [lat, lng] pairs for each participant
 * @body {string[][]} filters - Array of restaurant filters (e.g., [['Italian'], ['$$']])
 * @body {Object} [options] - Additional options
 * @body {number} [options.minAcceptableScore=50] - Minimum acceptable score for a location
 * @body {number} [options.minRestaurantCount=5] - Minimum number of restaurants required
 * @returns {Object} Response object
 * @returns {Object} bestScore - Score information for the best location
 * @returns {number} bestScore.totalScore - Overall score for the location
 * @returns {number} bestScore.restaurantCount - Number of restaurants found
 * @returns {number} bestScore.avgDistance - Average distance to restaurants
 * @returns {Array} bestScore.bestRestaurants - Top 10 restaurants in the area
 * @returns {string} bestMethod - Method used to find the best location
 */
router.post('/find', midpointValidators.calculateMidpoint, findOptimalLocationController);

/**
 * @route GET /api/midpoint/place-image/:id
 * @desc Get images for a specific place
 * @access Private
 * @param {string} id - The ID of the place to get images for
 * @returns {Array} Array of image URLs
 */
router.get('/place-image/:id', midpointValidators.getPlaceImages, getPlaceImagesController);

export default router;
