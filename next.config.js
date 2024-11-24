const nextConfig = {
  // Remove or adjust this if not needed for your use case
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
