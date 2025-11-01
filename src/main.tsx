import "./index.css";
import "leaflet/dist/leaflet.css";
import { ErrorFallback } from "@rm-hull/chakra-error-fallback";
import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot, RootOptions } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import ReactGA from "react-ga4";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import { Provider } from "./components/ui/provider";
import { Toaster } from "./components/ui/toaster";
import { reportWebVitals } from "./reportWebVitals";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

if (import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID !== undefined) {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID as string);
}

if (import.meta.env.VITE_SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN as string,
    release: import.meta.env.VITE_GIT_COMMIT_HASH as string,
    environment: import.meta.env.MODE,
  });
}

const queryClient = new QueryClient();

const errorHandling: RootOptions = {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
};

createRoot(document.getElementById("root")!, errorHandling).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    <Provider>
      <Router basename="/maps">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Toaster />
          <App />
        </ErrorBoundary>
      </Router>
    </Provider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.debug);
