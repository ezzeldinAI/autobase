"use server";

import {
  consoleLoggingIntegration,
  init,
  vercelAIIntegration,
} from "@sentry/nextjs";

init({
  dsn: "https://401cf84f346659cba520d550e8c23a3f@o4510431704121344.ingest.de.sentry.io/4510431715590224",
  integrations: [
    vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
    consoleLoggingIntegration({
      levels: ["log", "warn", "error", "debug", "trace", "assert", "info"],
    }),
  ],
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  enableLogs: true,
});
