// Path: /next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⭐ เพิ่ม standalone output สำหรับ Docker
  output: "standalone",

  // Enable static file serving
  experimental: {
    // This ensures CSV files in public folder are properly served
    serverComponentsExternalPackages: ["papaparse"],
  },

  // Headers for proper CSV serving
  async headers() {
    return [
      {
        source: "/product_list_csv.csv",
        headers: [
          {
            key: "Content-Type",
            value: "text/csv",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },

  // Handle webpack configuration for CSV parsing
  webpack: (config) => {
    // Handle CSV files
    config.module.rules.push({
      test: /\.csv$/,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
