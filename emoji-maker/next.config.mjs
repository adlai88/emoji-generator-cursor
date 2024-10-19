/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['replicate.delivery'], // Add other domains if needed
        remotePatterns: [
            {
              protocol: 'https',
              hostname: '**',
            },
          ],
    }
};

export default nextConfig;
