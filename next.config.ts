import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    // Remove reactCompiler as it's not a valid option in this version
  },
  experimental: {
    // Add any experimental features here if needed
  },
  // Disable webpack 5's filesystem cache to prevent caching issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include certain files in the client build
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
