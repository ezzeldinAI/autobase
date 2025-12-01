import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { ROUTER_CONSTANTS } from "@/constants/router";

const nextConfig: NextConfig = {
  async redirects() {
    // make it optional in the future to prevent unwanted redirects when user wants to landing page (that's if there's a public marketing landing page)
    return [
      {
        source: "/",
        destination: ROUTER_CONSTANTS.BASE,
        permanent: false,
      },
    ];
  },
  reactCompiler: true,
  devIndicators: false,
};

export default withSentryConfig(nextConfig, {
  org: "autobase",
  project: "autobase",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
