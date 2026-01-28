/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
    env: {
      NEXTAUTH_URL: 'https://mintcream-zebra-738412.hostingersite.com',
    },
  };

  export default nextConfig;
