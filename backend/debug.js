import { geometricMidpoint } from './midpoint/calcGeometricMidpoint.js';
import { smartMidpoint } from './midpoint/calcSmartMidpoint.js';
import { findBestRestaurantLocation } from './midpoint/calcRestaurantScores.js';
import { fetchAllCities, scoreLocationRestaurants, displayRestaurantResults } from './midpoint/midpointUtils.js'

import dotenv from 'dotenv';
dotenv.config();

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

// Test coordinates for debugging
const testCoordinates = [
    [40.7128, -74.0060], // New York, NY
    [34.0522, -118.2437], // Los Angeles, CA
    [41.8781, -87.6298], // Chicago, IL
    [37.7749, -122.4194], // San Francisco, CA
    [29.7604, -95.3698], // Houston, TX
];

// Filters for restaurant scoring (2D array)
const testFilters = [["Italian"], ["$$"], ["parking"]];

// Debugging function for geometric midpoint
const debugGeometricMidpoint = () => {
    console.log("=== Testing Geometric Midpoint ===");
    try {
        const result = geometricMidpoint(testCoordinates);
        console.log("Geometric Midpoint Result:");
        console.log(result);
    } catch (error) {
        console.error("Error in geometricMidpoint:", error.message);
    }
    console.log("=".repeat(50));
};

// Debugging function for smart midpoint
const debugSmartMidpoint = async () => {
    console.log("=== Testing Smart Midpoint ===");
    try {
        const result = await smartMidpoint(testCoordinates);
        console.log("Smart Midpoint Result:");
        console.log(result);
    } catch (error) {
        console.error("Error in smartMidpoint:", error.message);
    }
    console.log("=".repeat(50));
};

// Debugging function for restaurant scoring
const debugScoreLocationRestaurants = async () => {
    console.log("=== Testing Restaurant Scoring ===");
    try {
        const testLocation = [40.7128, -74.0060]; // New York, NY
        console.log("Testing Location:", testLocation); // Log the coordinates

        const result = await scoreLocationRestaurants(
            testLocation,
            testFilters,
            FOURSQUARE_API_KEY
        );
        console.log("Restaurant Scoring Result:");
        console.log(result);
    } catch (error) {
        console.error("Error in scoreLocationRestaurants:", error.message);
    }
    console.log("=".repeat(50));
};

// Debugging function for fetching cities
const debugFetchAllCities = async () => {
    console.log("=== Testing Fetch All Cities ===");
    try {
        const cities = await fetchAllCities();
        console.log("Fetched Cities (first 5):");
        console.log(cities.slice(0, 5));
    } catch (error) {
        console.error("Error in fetchAllCities:", error.message);
    }
    console.log("=".repeat(50));
};

const testLocationSets = async () => {
    console.log("=== Testing Location Sets ===");

    // Define sets of 3 locations from the original Python file
    const locationSets = [
        // Set 1: New York, Los Angeles, Chicago
        [
            [40.7128, -74.0060], // New York, NY
            [34.0522, -118.2437], // Los Angeles, CA
            [41.8781, -87.6298], // Chicago, IL
        ],
        // Set 2: San Francisco, Houston, Phoenix
        [
            [37.7749, -122.4194], // San Francisco, CA
            [29.7604, -95.3698], // Houston, TX
            [33.4484, -112.0740], // Phoenix, AZ
        ],
        // Set 3: Miami, Atlanta, Dallas
        [
            [25.7617, -80.1918], // Miami, FL
            [33.7490, -84.3880], // Atlanta, GA
            [32.7767, -96.7970], // Dallas, TX
        ],
    ];

    for (let i = 0; i < locationSets.length; i++) {
        const locations = locationSets[i];
        console.log(`\nTesting Location Set ${i + 1}:`);
        console.log(locations);

        // Test geometric midpoint
        try {
            const geometricResult = geometricMidpoint(locations);
            console.log("Geometric Midpoint Result:");
            console.log(geometricResult);
        } catch (error) {
            console.error("Error in geometricMidpoint:", error.message);
        }

        // Test smart midpoint
        try {
            const smartResult = await smartMidpoint(locations);
            console.log("Smart Midpoint Result:");
            console.log(smartResult);
        } catch (error) {
            console.error("Error in smartMidpoint:", error.message);
        }

        // Test restaurant scoring for the geometric midpoint
        try {
            const geometricResult = geometricMidpoint(locations);
            const score = await scoreLocationRestaurants(
                geometricResult.midpoint,
                testFilters,
                FOURSQUARE_API_KEY
            );
            console.log("Restaurant Scoring Result for Geometric Midpoint:");
            console.log(score);
        } catch (error) {
            console.error("Error in scoreLocationRestaurants:", error.message);
        }

        // Test restaurant scoring for the smart midpoint
        try {
            const smartResult = await smartMidpoint(locations);
            const score = await scoreLocationRestaurants(
                smartResult.midpoint,
                testFilters,
                FOURSQUARE_API_KEY
            );
            console.log("Restaurant Scoring Result for Smart Midpoint:");
            console.log(score);
        } catch (error) {
            console.error("Error in scoreLocationRestaurants:", error.message);
        }

        console.log("=".repeat(50));
    }
};


// Main debug function
const runDebugTests = async () => {
    console.log("Starting Debug Tests...\n");

    // Test geometric midpoint
    debugGeometricMidpoint();

    // Test smart midpoint
    await debugSmartMidpoint();

    // Test restaurant scoring
    await debugScoreLocationRestaurants();

    // Test fetching cities
    await debugFetchAllCities();

    // Test location sets
    await testLocationSets();

    console.log("Debug Tests Completed.");
};




// Run the debug tests
runDebugTests().catch((error) => {
    console.error("Error running debug tests:", error);
});