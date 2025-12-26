/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'www.roblox.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbnails.roblox.com',
      },
      {
        protocol: 'https',
        hostname: 'hhyqkflwqlfzjvswarty.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
