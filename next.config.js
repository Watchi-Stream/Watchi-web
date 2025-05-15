/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'ghkvnphzaifgjbvmgmcv.supabase.co',
      'randomuser.me', 
      'via.placeholder.com',
      'i.imgur.com',
      'media.kitsu.io',
      'cdn.myanimelist.net',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  },
};

module.exports = nextConfig; 