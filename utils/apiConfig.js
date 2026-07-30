/**
 * Utility to get the active backend API URL.
 * Automatically switches between local development (http://localhost:7863)
 * and Vercel cloud backend (https://pasangan-kucing-backend-main.vercel.app).
 */
export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocalhost) {
      return "http://localhost:7863";
    }
  }
  
  return "https://pasangan-kucing-backend-main.vercel.app";
};
