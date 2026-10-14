/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },
  async redirects() {
    return [
      // Old admin pages, replaced by Website content / Messages / Survey responses
      { source: '/admin/settings', destination: '/admin/content', permanent: false },
      { source: '/admin/submissions', destination: '/admin/messages', permanent: false },
    ];
  },
};

export default nextConfig;
