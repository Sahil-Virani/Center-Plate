import { geometricMidpoint } from '../midpoint/calcGeoMidpoint.js';
import { smartMidpoint } from '../midpoint/calcSmartMidpoint.js';
import { fetchAllCities } from '../midpoint/midpointUtils.js';
import { findBestRestaurantLocation } from '../midpoint/getRestaurants.js';
import { getRestaurantImages } from '../midpoint/restaurantImages.js';
import logger from '../logger.js';

/**
 * Validates coordinates array
 * @param {number[][]} coordinates - Array of [lat, lng] pairs
 * @throws {Error} If coordinates are invalid
 */
const validateCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates)) {
        throw new Error("Coordinates must be an array");
    }
    if (coordinates.length < 2) {
        throw new Error("At least 2 coordinates are required");
    }
    
    coordinates.forEach((coord, index) => {
        if (!Array.isArray(coord)) {
            throw new Error(`Coordinate at index ${index} must be an array`);
        }
        if (coord.length !== 2) {
            throw new Error(`Coordinate at index ${index} must have exactly 2 values (lat, lng)`);
        }
        const [lat, lng] = coord;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error(`Coordinate values at index ${index} must be numbers`);
        }
        if (lat < -90 || lat > 90) {
            throw new Error(`Latitude at index ${index} must be between -90 and 90`);
        }
        if (lng < -180 || lng > 180) {
            throw new Error(`Longitude at index ${index} must be between -180 and 180`);
        }
    });
};

/**
 * Validates filters array
 * @param {string[][]} filters - Array of filter arrays
 * @throws {Error} If filters are invalid
 */
const validateFilters = (filters) => {
    if (!filters || !Array.isArray(filters)) {
        throw new Error("Filters must be an array");
    }
    
    filters.forEach((filter, index) => {
        if (!Array.isArray(filter)) {
            throw new Error(`Filter at index ${index} must be an array`);
        }
        if (filter.length === 0) {
            throw new Error(`Filter at index ${index} cannot be empty`);
        }
        filter.forEach((value, valueIndex) => {
            if (typeof value !== 'string') {
                throw new Error(`Filter value at index ${index}.${valueIndex} must be a string`);
            }
            if (!value.trim()) {
                throw new Error(`Filter value at index ${index}.${valueIndex} cannot be empty`);
            }
        });
    });
};

/**
 * Validates options object
 * @param {Object} options - Options object
 * @throws {Error} If options are invalid
 */
const validateOptions = (options) => {
    if (options.minAcceptableScore !== undefined) {
        if (typeof options.minAcceptableScore !== 'number') {
            throw new Error("minAcceptableScore must be a number");
        }
        if (options.minAcceptableScore < 0 || options.minAcceptableScore > 100) {
            throw new Error("minAcceptableScore must be between 0 and 100");
        }
    }
    if (options.minRestaurantCount !== undefined) {
        if (typeof options.minRestaurantCount !== 'number') {
            throw new Error("minRestaurantCount must be a number");
        }
        if (options.minRestaurantCount < 1) {
            throw new Error("minRestaurantCount must be at least 1");
        }
    }
};

/**
 * Finds the optimal meeting location based on participant coordinates and restaurant preferences
 * @param {number[][]} coordinates - Array of [lat, lng] pairs for each participant
 * @param {string[][]} filters - Array of restaurant filters (e.g., [['Italian'], ['$$']])
 * @param {Object} options - Additional options
 * @param {number} options.minAcceptableScore - Minimum acceptable score for a location (default: 50)
 * @param {number} options.minRestaurantCount - Minimum number of restaurants required (default: 5)
 * @returns {Promise<Object>} Best location with restaurant information
 */
export async function findOptimalLocation(coordinates, filters, options = {}) {
    try {
        logger.info("Finding optimal location for %d participants", coordinates.length);
        
        // Validate inputs
        validateCoordinates(coordinates);
        validateFilters(filters);
        validateOptions(options);
        
        const { minAcceptableScore = 50, minRestaurantCount = 5 } = options;
        const results = [];
        
        // Calculate midpoints using different methods
        try {
            logger.info("Calculating geometric midpoint...");
            const geometric = geometricMidpoint(coordinates);
            results.push({
                coordinates: geometric.midpoint,
                method_name: 'geometric',
                metrics: geometric.metrics
            });
            logger.info("Geometric midpoint calculated successfully");
        } catch (e) {
            logger.error("Geometric midpoint calculation failed: %s", e.message);
            throw new Error("Failed to calculate geometric midpoint: " + e.message);
        }

        try {
            logger.info("Calculating smart midpoint...");
            const smart = await smartMidpoint(coordinates);
            results.push({
                coordinates: smart.midpoint,
                method_name: 'smart',
                metrics: smart.metrics
            });
            logger.info("Smart midpoint calculated successfully");
        } catch (e) {
            logger.error("Smart midpoint calculation failed: %s", e.message);
            throw new Error("Failed to calculate smart midpoint: " + e.message);
        }

        if (results.length === 0) {
            throw new Error("All midpoint calculations failed");
        }

        // Find best restaurant location
        logger.info("Finding best restaurant location...");
        const cities = await fetchAllCities();
        const bestLocation = await findBestRestaurantLocation(
            results,
            cities,
            filters,
            minAcceptableScore,
            minRestaurantCount
        );

        if (!bestLocation || !bestLocation.bestScore) {
            throw new Error("No suitable location found matching the criteria");
        }

        logger.info("Best location found with score: %d", bestLocation.bestScore.totalScore);
        return bestLocation;
    } catch (e) {
        logger.error("Error finding optimal location: %s", e.message);
        throw new Error("Error finding optimal location: " + e.message);
    }
}

/**
 * Gets images for a specific place
 * @param {string} placeId - The ID of the place
 * @returns {Promise<Array>} Array of image URLs
 */
export async function getPlaceImages(placeId) {
    try {
        if (!placeId) {
            throw new Error("Place ID is required");
        }
        if (typeof placeId !== 'string') {
            throw new Error("Place ID must be a string");
        }
        if (!placeId.trim()) {
            throw new Error("Place ID cannot be empty");
        }

        logger.info("Fetching images for place: %s", placeId);
        const images = await getRestaurantImages(placeId);
        if (!Array.isArray(images)) {
            throw new Error("Invalid response format from image service");
        }
        logger.info("Successfully fetched %d images", images.length);
        return images;
    } catch (e) {
        logger.error("Error fetching place images: %s", e.message);
        throw new Error("Error fetching place images: " + e.message);
    }
} 