import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  /* config options here */
};

export default withMDX({
  extension: /\.mdx?$/,
})(nextConfig);
