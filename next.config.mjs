/** @type {import('next').NextConfig} */
const nextConfig = {
  // F7 FIX: Use NEXT_PUBLIC_ prefix so env vars are accessible on the client side.
  // Set NEXT_PUBLIC_API_URL in your .env.local (local) and Vercel dashboard (production).
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7863",
  },
};

export default nextConfig;
