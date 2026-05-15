// Sentry client instrumentation disabled - @sentry/nextjs v10 has a known
// incompatibility with Next.js 15 App Router (generates pages/_error with Html import).
// Re-enable after upgrading to a compatible Sentry SDK version.
//
// import * as Sentry from "@sentry/nextjs";
// Sentry.init({
//   dsn: "https://f55d2a90911c920f58a11eea551942ef@o4511388303360000.ingest.us.sentry.io/4511388310044672",
//   integrations: [Sentry.browserTracingIntegration()],
//   tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
//   tracePropagationTargets: ["localhost", /^https:\/\/visitvagad\.com\/api/],
// });
