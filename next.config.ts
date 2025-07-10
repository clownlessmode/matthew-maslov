import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX({
  extension: /\.mdx?$/,
})(nextConfig);
