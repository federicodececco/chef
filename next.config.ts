import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
/* 
const nextConfig: NextConfig = {}; */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
