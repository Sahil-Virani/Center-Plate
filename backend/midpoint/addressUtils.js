import fetch from 'node-fetch';
const NOMINATIM_URL = "https://nominatim.openstreetmap.org"

// Function to get coordinates from an address
const addressToCoordinates = async (address) => {
    try {
        const params = new URLSearchParams({
            q: address,
            format: "json",
            limit: 1,
        });

        const response = await fetch(`${NOMINATIM_URL}/search?${params}`);
        if (!response.ok) throw new Error(`Error fetching coordinates: ${response.status}`);
        const data = await response.json();

        if (data.length === 0) {
            throw new Error("No coordinates found for the given address.");
        }

        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } catch (error) {
        console.error("Error in getCoordinates:", error.message);
        return null;
    }
};

// Function to get an address from coordinates
const coordinatesToAddress = async (latitude, longitude) => {
    try {
        const params = new URLSearchParams({
            lat: latitude,
            lon: longitude,
            format: "json",
        });

        const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`);
        if (!response.ok) throw new Error(`Error fetching address: ${response.status}`);
        const data = await response.json();

        if (!data.display_name) {
            throw new Error("No address found for the given coordinates.");
        }

        return data.display_name;
    } catch (error) {
        console.error("Error in getAddress:", error.message);
        return null;
    }
};

export { addressToCoordinates, coordinatesToAddress};