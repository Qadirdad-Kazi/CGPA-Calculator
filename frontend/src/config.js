// Ensure API URL always ends with /api
let baseUrl = process.env.REACT_APP_API_URL || "https://cgpa-calculator-wine.vercel.app/api";

// If the URL doesn't end with /api, add it
if (!baseUrl.endsWith('/api')) {
  // Remove trailing slash if present
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Add /api
  baseUrl = baseUrl + '/api';
}

export const API_URL = baseUrl;

// Debug logging
console.log('API_URL configured as:', API_URL);
console.log('Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
