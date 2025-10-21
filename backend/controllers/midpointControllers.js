import { 
    findOptimalLocation,
    getPlaceImages
} from '../services/midpointService.js';
import logger from '../logger.js';

/**
 * Finds the optimal meeting location based on participant coordinates and restaurant preferences
 */
export async function findOptimalLocationController(req, res) {
    try {
        logger.info("Handling find optimal location request");
        const { coordinates, filters, options } = req.body;
        
        if (!coordinates) {
            return res.status(400).json({ 
                error: "Validation Error",
                details: "Coordinates are required"
            });
        }

        const result = await findOptimalLocation(coordinates, filters, options);
        if (!result) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "No suitable location found with the given criteria"
            });
        }
        logger.info("Successfully found optimal location");
        return res.json(result);
    } catch (e) {
        logger.error("Error in find optimal location controller: %s", e.message);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation Error",
                details: e.message 
            });
        }
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message
        });
    }
}

/**
 * Gets images for a specific place
 */
export async function getPlaceImagesController(req, res) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: "Validation Error",
                details: "Place ID is required"
            });
        }

        logger.info("Handling get place images request for id: %s", id);
        const images = await getPlaceImages(id);
        if (!images) {
            return res.status(404).json({ 
                error: "Not Found",
                details: "No images found for the specified place"
            });
        }
        logger.info("Successfully fetched place images");
        return res.json(images);
    } catch (e) {
        logger.error("Error in get place images controller: %s", e.message);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation Error",
                details: e.message 
            });
        }
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: e.message
        });
    }
} 