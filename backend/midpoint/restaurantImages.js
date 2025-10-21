import fetch from 'node-fetch';
import dotenv from 'dotenv';
import logger from '../logger.js';

dotenv.config();

const FOURSQUARE_API_URL = "https://api.foursquare.com/v3/places";
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

/**
 * Formats a Foursquare photo URL with the correct size and quality
 * @param {string} prefix - The URL prefix from Foursquare
 * @param {string} suffix - The URL suffix from Foursquare
 * @param {string} size - The desired image size (original, 144x144, 300x300, 500x500)
 * @returns {string} The formatted image URL
 */
function formatImageUrl(prefix, suffix, size = 'original') {
    if (!prefix || !suffix) return null;
    return `${prefix}${size}${suffix}`;
}

/**
 * Gets images for a specific restaurant
 * @param {string} restaurantId - The Foursquare ID of the restaurant
 * @returns {Promise<Array>} Array of image objects with URLs and metadata
 */
export async function getRestaurantImages(restaurantId) {
    const headers = { "Authorization": FOURSQUARE_API_KEY };
    
    try {
        logger.info("Fetching images for restaurant: %s", restaurantId);
        const response = await fetch(`${FOURSQUARE_API_URL}/${restaurantId}/photos`, { headers });
        
        if (!response.ok) {
            logger.warn("No images found for restaurant: %s", restaurantId);
            return [];
        }
        
        const data = await response.json();
        const formattedImages = data.map(photo => ({
            id: photo.id,
            createdAt: photo.created_at,
            url: formatImageUrl(photo.prefix, photo.suffix),
            thumbnailUrl: formatImageUrl(photo.prefix, photo.suffix, '300x300'),
            width: photo.width,
            height: photo.height,
            visibility: photo.visibility
        })).filter(img => img.url !== null);
        
        logger.info("Successfully fetched %d images for restaurant: %s", formattedImages.length, restaurantId);
        return formattedImages;
    } catch (e) {
        logger.error("Error fetching restaurant images: %s", e.message);
        throw new Error("Failed to fetch restaurant images: " + e.message);
    }
} 