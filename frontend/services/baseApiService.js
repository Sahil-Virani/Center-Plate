import axios from 'axios';
import { getAuth } from 'firebase/auth';

class BaseApiService {
    constructor() {
        this.auth = getAuth();
        this.api = axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to add auth token
        this.api.interceptors.request.use(
            async (config) => {
                // Skip auth token for user creation
                if (config.url === '/users' && config.method === 'post') {
                    return config;
                }
                const token = await this.getAuthToken();
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle errors
        this.api.interceptors.response.use(
            (response) => response.data,
            (error) => {
                console.error('API request error:', error);
                // Extract error message from the backend response
                const errorMessage = error.response?.data?.error || 
                                   error.response?.data?.details || 
                                   error.response?.data?.message || 
                                   'API request failed';
                throw new Error(errorMessage);
            }
        );
    }

    async getAuthToken() {
        const user = this.auth.currentUser;
        if (!user) {
            throw new Error('No authenticated user found');
        }
        return await user.getIdToken();
    }

    async get(endpoint, params) {
        return this.api.get(endpoint, params);
    }

    async post(endpoint, data) {
        return this.api.post(endpoint, data);
    }

    async put(endpoint, data) {
        return this.api.put(endpoint, data);
    }

    async patch(endpoint, data) {
        return this.api.patch(endpoint, data);
    }

    async delete(endpoint) {
        return this.api.delete(endpoint);
    }
}

export default new BaseApiService(); 