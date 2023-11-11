/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "msquarefdc.sgp1.digitaloceanspaces.com",
      },
    ],
  },
};

module.exports = nextConfig;
