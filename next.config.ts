import { resolve } from "node:path";
import type { NextConfig } from "next";
import { merge } from "webpack-merge";
import { InjectManifest } from "workbox-webpack-plugin";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dir }) =>
    isServer
      ? config
      : merge(config, {
          output: {
            hotUpdateMainFilename: config.output.hotUpdateMainFilename.replace(
              "[fullhash].hot-update.json",
              "[runtime].[fullhash].hot-update.json",
            ),
          },
          plugins: [
            new InjectManifest({
              swSrc: resolve(dir, "src", "workers", "service"),
              swDest: resolve(
                config.output.path,
                "static",
                "chunks",
                "service.worker.js",
              ),
            }),
          ],
        }),
  headers: async () => [
    {
      source: "/_next/static/chunks/service.worker.js",
      headers: [
        {
          key: "Service-Worker-Allowed",
          value: "/",
        },
      ],
    },
  ],
};

export default nextConfig;
