/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['image.tmdb.org', 'tmdb.org', 'themoviedb.org'],
  },
};

module.exports = nextConfig;
