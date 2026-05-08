import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita fallo `lockfile` (ENOENT) en Windows con rutas Unicode al proyecto.
  experimental: {
    lockDistDir: false,
    turbopackFileSystemCacheForDev: false,
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      { module: /node_modules[\\/]web-ifc/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    return config;
  },
};

export default nextConfig;
