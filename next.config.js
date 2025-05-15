// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['nhanmac.vn','localhost'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3600',
          pathname: '/uploads/**',
          
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  