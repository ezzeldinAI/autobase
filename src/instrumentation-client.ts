import {
  captureRouterTransitionStart,
  init,
  replayIntegration,
} from "@sentry/nextjs";

init({
  dsn: "https://401cf84f346659cba520d550e8c23a3f@o4510431704121344.ingest.de.sentry.io/4510431715590224",

  integrations: [replayIntegration()],

  tracesSampleRate: 1,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = captureRouterTransitionStart;
