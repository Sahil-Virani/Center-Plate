const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';
import axios from 'axios';
import baseApiService from './baseApiService';

class LocationService {
    async findOptimalLocation(coordinates, filters, options) {
        return baseApiService.post('/midpoint/find', { coordinates, filters, options });
    }

    async getPlaceImages(placeId) {
        return baseApiService.get(`/midpoint/place-image/${placeId}`);
    }

    async getAddressFromCoordinates(latitude, longitude) {
        return getAddressFromCoordinates(latitude, longitude);
    }

    async getCoordinatesFromAddress(address) {
        return getCoordinatesFromAddress(address);
    }

    async validateAddress(address) {
        return validateAddress(address);
    } 
}



async function validateAddress(address) {
    try {
        const query = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
        const response = await axios.get(
            `${NOMINATIM_API_URL}/search`,
            {
                params: {
                    format: 'json',
                    q: query,
                    limit: 1
                },
                headers: {
                    'Accept-Language': 'en-US,en;q=0.9',
                    'User-Agent': 'CenterPlate/1.0'
                }
            }
        );
        
        if (!response.data || response.data.length === 0) {
            throw new Error('Address not found');
        }

        return {
            coordinates: {
                latitude: parseFloat(response.data[0].lat),
                longitude: parseFloat(response.data[0].lon)
            }
        };
    } catch (error) {
        console.error('Error validating address:', error);
        if (error.response) {
            // Nominatim API returns error messages in the response data
            const errorMessage = error.response.data.error || 'Failed to validate address';
            throw new Error(errorMessage);
        }
        throw error;
    }
}

async function getAddressFromCoordinates(latitude, longitude) {
        try {
            const response = await axios.get(
                `${NOMINATIM_API_URL}/reverse`,
                {
                    params: {
                        format: 'json',
                        lat: latitude,
                        lon: longitude
                    },
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': 'CenterPlate/1.0'
                    }
                }
            );

            if (!response.data || !response.data.address) {
                throw new Error('Could not get address from coordinates');
            }

            const address = response.data.address;
            
            // Convert state name to 2-letter code
            let stateCode = address.state;
            if (stateCode && stateCode.length > 2) {
                // Map common state names to their codes
                const stateMap = {
                    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
                    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
                    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
                    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
                    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
                    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
                    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
                    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
                    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
                    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
                };
                stateCode = stateMap[stateCode] || stateCode;
            }

            return {
                street: address.road || address.street || '',
                city: address.city || address.town || address.village || '',
                state: stateCode || '',
                zipCode: address.postcode || ''
            };
        } catch (error) {
            console.error('Error getting address from coordinates:', error);
            if (error.response) {
                // Nominatim API returns error messages in the response data
                const errorMessage = error.response.data.error || 'Failed to get address from coordinates';
                throw new Error(errorMessage);
            }
            throw error;
        }
}

async function getCoordinatesFromAddress(address) {
    try {
        const query = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
        const response = await axios.get(
                `${NOMINATIM_API_URL}/search`,
                {
                    params: {
                        format: 'json',
                        q: query,
                        limit: 1
                    },
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': 'CenterPlate/1.0'
                    }
                }
            );

            if (!response.data || response.data.length === 0) {
                throw new Error('Address not found');
            }

            return {
                coordinates: {
                    latitude: parseFloat(response.data[0].lat),
                    longitude: parseFloat(response.data[0].lon)
                }
            };
        } catch (error) {
            console.error('Error getting coordinates from address:', error);
            if (error.response) {
                // Nominatim API returns error messages in the response data
                const errorMessage = error.response.data.error || 'Failed to get coordinates from address';
                throw new Error(errorMessage);
            }
            throw error;
        }
}

export default new LocationService();