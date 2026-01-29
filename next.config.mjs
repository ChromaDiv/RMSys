/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: 'https://mintcream-zebra-738412.hostingersite.com',
    NEXT_PUBLIC_SUPABASE_URL: 'https://pjlifzwsxqbeetliyniw.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbGlmendzeHFiZWV0bGl5bml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDkxOTQsImV4cCI6MjA4NDkyNTE5NH0.SNc3py6WkJozjskchIdq2oAmftSB2kmoRd_2eU1GsZQ',
  },
};

export default nextConfig;
