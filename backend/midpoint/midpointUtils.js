import geolib from 'geolib';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import logger from '../logger.js';

dotenv.config();

const FOURSQUARE_API_URL = "https://api.foursquare.com/v3/places";
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

// Log API key status (not the actual key for security)
if (!FOURSQUARE_API_KEY) {
    logger.error("FOURSQUARE_API_KEY is not set in environment variables!");
} else {
    logger.info("FOURSQUARE_API_KEY is properly configured");
}

const CITIES_URL = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&refine.country_code=US";

/**
 * Fetches all cities from the OpenDataSoft API
 * @returns {Promise<Array>} Array of city objects with name, coordinates, and population
 */
async function fetchAllCities() {
    try {
        logger.info("Fetching cities from OpenDataSoft API");
        const response = await fetch(CITIES_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch cities: ${response.status}`);
        }
        
        const data = await response.json();
        const cities = data.records.map(city => ({
            name: city.fields.name || "Unknown",
            coordinates: city.fields.coordinates,
            population: city.fields.population || 0,
        }));
        
        logger.info("Successfully fetched %d cities", cities.length);
        return cities;
    } catch (error) {
        logger.error("Error fetching cities: %s", error.message);
        throw new Error("Failed to fetch cities: " + error.message);
    }
}

/**
 * Scores a location based on the number of restaurants that fit the given filters
 * @param {number[]} coordinates - The coordinates of the location to score
 * @param {string[][]} filters - A list of filters to apply to the search for restaurants
 * @param {number} [minAcceptableScore=50] - The minimum score required for the location to be acceptable
 * @param {number} [minRestaurantCount=5] - The minimum number of restaurants required
 * @returns {Promise<Object>} Object containing location score and restaurant information
 */
async function scoreLocationRestaurants(coordinates, filters, minAcceptableScore = 50, minRestaurantCount = 5) {
    const [latitude, longitude] = coordinates;
    const headers = { "Authorization": FOURSQUARE_API_KEY };
    
    
    // If no filters provided, search for all restaurants
    const filterCombinations = filters && filters.length > 0 
        ? filters.flatMap((_, i) => filters.slice(0, i + 1).map(combo => combo.join(" ")))
        : [""]; // Empty string to search for all restaurants
    
    let foundRestaurants = [];
    let restaurantScores = [];
    let rset = new Set();

    for (const query of filterCombinations) {
        const params = new URLSearchParams({
            ll: `${latitude},${longitude}`,
            categories: "13065", // Restaurant category
            limit: "50", // Increased limit for better results
            fields: "fsq_id,geocodes,name,location,categories,photos" // Add photos field
        });

        // Only add query parameter if we have a query
        if (query) {
            params.append("query", query);
        }

        try {
            console.log("headers: ", headers);
            console.log("params: ", params);
            const response = await fetch(`${FOURSQUARE_API_URL}/search?${params}`, { headers });
            console.log("response: ", response);
            if (!response.ok) {
                logger.warn("Failed to fetch restaurants for query: %s", query || "all");
                continue;
            }
            
            const { results } = await response.json();

            for (const result of results) {
                const { fsq_id, geocodes, name, location, categories, photos } = result;
                
                if (!rset.has(fsq_id)) {
                    rset.add(fsq_id);
                    const { latitude: restLat, longitude: restLng } = geocodes?.main || {};
                    if (!restLat || !restLng) continue;
                    
                    const distance = geolib.getDistance(
                        { latitude, longitude },
                        { latitude: restLat, longitude: restLng }
                    ) / 1000;
                    
                    // If no filters, score based only on distance
                    // If filters exist, score based on both distance and filter match
                    const score = filters && filters.length > 0
                        ? (0.6 * (1 / (1 + distance / 5)) + 0.4 * (query.split(' ').length / filters.length)) * 100
                        : (1 / (1 + distance / 5)) * 100;

                    // Get all photos if available
                    let photoUrls = [];
                    if (photos && photos.length > 0) {
                        photoUrls = photos.map(photo => `${photo.prefix}original${photo.suffix}`);
                    }
                    
                    foundRestaurants.push({ 
                        fsq_id, 
                        name, 
                        address: location?.address,
                        images: photoUrls,
                        score, 
                        distance,
                        coordinates: [restLat, restLng],
                        categories: categories?.map(cat => cat.name) || []
                    });
                    restaurantScores.push(score);
                }
            }
        } catch (e) {
            logger.error("Error processing query '%s': %s", query || "all", e.message);
        }
    }

    if (!restaurantScores.length) {
        logger.warn("No restaurants found for coordinates: [%f, %f]", latitude, longitude);
        return { 
            location: coordinates, 
            totalScore: 0, 
            restaurantCount: 0, 
            avgDistance: Infinity, 
            bestRestaurants: [] 
        };
    }
    
    foundRestaurants.sort((a, b) => b.score - a.score);
    const result = {
        location: coordinates,
        totalScore: restaurantScores.reduce((a, b) => a + b, 0) / restaurantScores.length,
        restaurantCount: foundRestaurants.length,
        avgDistance: foundRestaurants.reduce((a, b) => a + b.distance, 0) / foundRestaurants.length,
        bestRestaurants: foundRestaurants.slice(0, 10)
    };
    
    logger.info("Location scored successfully: %d restaurants found, score: %f", 
        result.restaurantCount, result.totalScore);
    return result;
}

const displayRestaurantResults = (score, method) => {
    console.log(`\nBest Location Found Using: ${method}`);
    console.log("=".repeat(50));
    console.log(`Location: (${score.location[0].toFixed(4)}, ${score.location[1].toFixed(4)})`);
    console.log(`Overall Score: ${score.totalScore.toFixed(2)}`);
    console.log(`Number of Restaurants Found: ${score.restaurantCount}`);
    console.log(`Average Distance: ${score.avgDistance.toFixed(2)} km\n`);

    console.log("Top 10 Restaurants:");
    console.log("-".repeat(50));
    score.bestRestaurants.forEach(({ name, address, score, distance }, i) => {
        console.log(`${i + 1}. ${name}`);
        console.log(`   Address: ${address}`);
        console.log(`   Score: ${score.toFixed(2)}`);
        console.log(`   Distance: ${distance.toFixed(2)} km\n`);
    });
};

const getRestaurantImages = async (restaurant) => {
  const headers = { "Authorization": FOURSQUARE_API_KEY };
  //const params = new URLSearchParams({ "classifications": "outdoor"});
  try {
   const response = await fetch(`${FOURSQUARE_API_URL}/${restaurant}/photos`, {headers: headers});
    if (!response.ok) {
      return {error: "no images for that restaurant"};
    }
    const inner = await response.json();
    return inner;
  }catch (e) {
    console.error("Could not get restaurant images: Error: ", e);
    return {error: e}
  }
}

export { displayRestaurantResults, fetchAllCities, scoreLocationRestaurants, getRestaurantImages };
