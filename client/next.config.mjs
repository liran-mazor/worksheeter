/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
  if (dev) {
    config.watchOptions = {
      poll: false,
      aggregateTimeout: 300,
    }
  }
  return config
}
}

export default nextConfig