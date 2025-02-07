// If REACT_APP_API_URL is set (for production), use it;
// otherwise, default to the localhost URL (for local development).
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
