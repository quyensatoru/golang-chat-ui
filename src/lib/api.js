import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const API_URL = window.__ENV__?.API_URL || 'http://localhost:3000';

export const api = {
    fetch: async (url, options = {}) => {
        // Ensure credentials are included by default for cookie-based auth
        const defaultOptions = {
            credentials: 'include',
            ...options,
            headers: {
                ...options.headers,
            },
        };

        // Construct full URL if it's a relative path
        const fullUrl = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;

        try {
            const response = await fetch(fullUrl, defaultOptions);

            if (response.status === 401) {
                // Redirect to login page on 401 Unauthorized
                // We use window.location to ensure a full refresh/redirect
                if (window.location.pathname !== '/') {
                    await signOut(auth);
                    window.location.href = '/';
                }
                return response;
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Helper methods
    get: (url, options = {}) => api.fetch(url, { ...options, method: 'GET' }),
    post: (url, body, options = {}) => api.fetch(url, {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        body: JSON.stringify(body)
    }),
    put: (url, body, options = {}) => api.fetch(url, {
        ...options,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        body: JSON.stringify(body)
    }),
    delete: (url, options = {}) => api.fetch(url, { ...options, method: 'DELETE' })
};
