import geolib from 'geolib';
import { fetchAllCities } from './midpointUtils.js';
import logger from '../logger.js';

/**
 * Calculates a smart midpoint that considers population centers and participant distribution
 * @param {number[][]} coordinates - Array of [lat, lng] pairs
 * @returns {Promise<Object>} Object containing the calculated midpoint and metrics
 */
const smartMidpoint = async (coordinates) => {
    try {
        logger.info("Calculating smart midpoint for %d coordinates", coordinates.length);
        const citiesData = await fetchAllCities();
        
        // Map cities to the format expected by the algorithm
        const majorHubs = citiesData.map(city => [
            city.coordinates[0], // latitude
            city.coordinates[1], // longitude
            city.population
        ]);

        const avgCoord = coordinates.reduce((acc, coord) => {
            acc[0] += coord[0];
            acc[1] += coord[1];
            return acc;
        }, [0, 0]).map(sum => sum / coordinates.length);

        const estimateHubScore = (lat, lng) => 1 / (1 + Math.min(...majorHubs.map(hub => geolib.getDistance(
            { latitude: lat, longitude: lng }, 
            { latitude: hub[0], longitude: hub[1] }
        ) / 1000)));

        const estimateDensityScore = (point) => {
            const distances = coordinates.map(coord => geolib.getDistance(
                { latitude: point[0], longitude: point[1] },
                { latitude: coord[0], longitude: coord[1] }
            ) / 1000);
            return 1 / (1 + distances.reduce((sum, d) => sum + d, 0) / distances.length);
        };

        const snapToNearestHub = (point) => majorHubs.reduce((nearest, hub) => {
            const dist = geolib.getDistance(
                { latitude: point[0], longitude: point[1] },
                { latitude: hub[0], longitude: hub[1] }
            );
            return dist < nearest.dist ? { point: [hub[0], hub[1]], dist } : nearest;
        }, { point, dist: Infinity }).point;

        let bestPoint = avgCoord;
        let bestScore = -Infinity;

        // Search in a grid around the average coordinate
        for (let lat = avgCoord[0] - 1; lat <= avgCoord[0] + 1; lat += 0.5) {
            for (let lng = avgCoord[1] - 1; lng <= avgCoord[1] + 1; lng += 0.5) {
                const hubScore = estimateHubScore(lat, lng);
                const densityScore = estimateDensityScore([lat, lng]);
                const totalScore = 0.4 * hubScore + 0.3 * densityScore;
                if (totalScore > bestScore) {
                    bestScore = totalScore;
                    bestPoint = [lat, lng];
                }
            }
        }

        // If the best point is too far from any participant, snap to nearest major hub
        const maxDistance = Math.max(...coordinates.map(coord => geolib.getDistance(
            { latitude: bestPoint[0], longitude: bestPoint[1] },
            { latitude: coord[0], longitude: coord[1] }
        ) / 1000));

        if (maxDistance > 500) {
            logger.info("Best point too far (%.1f km), snapping to nearest hub", maxDistance);
            bestPoint = snapToNearestHub(bestPoint);
        }

        logger.info("Smart midpoint calculated successfully at [%.4f, %.4f]", bestPoint[0], bestPoint[1]);
        return {
            midpoint: bestPoint,
            method_name: 'smart',
            metrics: { 
                bestScore,
                maxDistance,
                hubCount: majorHubs.length
            }
        };
    } catch (e) {
        logger.error("Error calculating smart midpoint: %s", e.message);
        throw new Error("Failed to calculate smart midpoint: " + e.message);
    }
};

export { smartMidpoint };
