// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        
        domains: ['nhanmac.vn','localhost','luattiendat.com.vn'],
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
  