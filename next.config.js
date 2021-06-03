const { merge } = require("webpack-merge");
const { InjectManifest } = require("workbox-webpack-plugin");
const { resolve } = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (webpackConfig, { isServer, dir }) => {
    if (isServer) return webpackConfig;
    return merge(webpackConfig, {
      plugins: [
        new InjectManifest({
          swSrc: resolve(dir, "src", "workers", "service.ts"),
          swDest: resolve(dir, "public", "service.worker.js"),
        }),
      ],
    });
  },
};
