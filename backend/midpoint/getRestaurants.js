import geolib from 'geolib';
import { scoreLocationRestaurants } from './midpointUtils.js';

/**
 * Finds the location that best fits the given filters, by trying all combinations of the
 * given midpoint calculation methods and the 5 nearest major cities. Returns an object
 * containing the best score and the name of the method that produced it.
 * @param {Object[]} midpointResults - The results of calling `calculateMidpoint` with
 *   the given filters. Should contain the coordinates of the midpoint and the name of the
 *   method used to calculate it.
 * @param {Object[]} citiesData - A list of cities, each with a `coordinates` property
 *   containing the city's coordinates and a `population` property containing the city's
 *   population.
 * @param {string[][]} filters - A list of filters to apply to the search for restaurants.
 * @param {string} foursquareApiKey - The API key to use to call the Foursquare API.
 * @param {number} [minAcceptableScore=50] - The minimum score required for the location
 *   to be acceptable.
 * @param {number} [minRestaurantCount=5] - The minimum number of restaurants required
 *   for the location to be acceptable.
 * @returns {Promise<{bestScore: number, bestMethod: string}>} - A promise resolving to
 *   an object with the best score and the name of the method that produced it.
 */
const findBestRestaurantLocation = async (midpointResults, citiesData, filters, minAcceptableScore = 50, minRestaurantCount = 5) => {
    let bestScore = null, bestMethod = null;
    
    for (const { coordinates, method_name } of midpointResults) {
        const score = await scoreLocationRestaurants(coordinates, filters, minAcceptableScore, minRestaurantCount);
        if (!bestScore || (score.totalScore > bestScore.totalScore && score.restaurantCount >= minRestaurantCount)) {
            bestScore = score;
            bestMethod = method_name;
        }
    }
    
    if (!bestScore || bestScore.totalScore < minAcceptableScore || bestScore.restaurantCount < minRestaurantCount) {
        const sortedCities = citiesData.sort((a, b) => b.population - a.population).slice(0, 300);
        const center = midpointResults.reduce((acc, { coordinates }) => [acc[0] + coordinates[0], acc[1] + coordinates[1]], [0, 0]).map(x => x / midpointResults.length);
        
        const nearestCities = sortedCities.map(city => ({
            city,
            distance: geolib.getDistance(
                { latitude: center[0], longitude: center[1] },
                { latitude: city.coordinates[0], longitude: city.coordinates[1] }
            ) / 1000
        })).sort((a, b) => a.distance - b.distance).slice(0, 5);

        for (const { city } of nearestCities) {
            const score = await scoreLocationRestaurants(city.coordinates, filters, minAcceptableScore, minRestaurantCount);
            if (!bestScore || (score.totalScore > bestScore.totalScore && score.restaurantCount >= minRestaurantCount)) {
                bestScore = score;
                bestMethod = `Nearest Major City (${city.city}, ${city.state})`;
            }
        }
    }
    
    return { bestScore, bestMethod };
};


export { findBestRestaurantLocation };
