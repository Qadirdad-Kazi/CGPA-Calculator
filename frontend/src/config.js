// Remove any trailing slash to prevent double slashes in URLs
const baseUrl = process.env.REACT_APP_API_URL || "https://cgpa-calculator-wine.vercel.app/api";
export const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

// Debug logging
console.log('API_URL configured as:', API_URL);
