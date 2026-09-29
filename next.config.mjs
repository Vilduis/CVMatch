/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse"],
  images: {
    // 95 para ilustraciones con texto fino (p. ej. /auth), donde 75 se ve borroso
    qualities: [75, 95],
  },
}

export default nextConfig
