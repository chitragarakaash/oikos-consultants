/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Amplify specific settings
  generateEtags: false,
  poweredByHeader: false,
  compress: false,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;