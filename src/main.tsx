import "./index.css";
import "leaflet/dist/leaflet.css";
import * as Sentry from "@sentry/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import ReactGA from "react-ga4";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import { ErrorFallback } from "./components/ErrorFallback";
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

  // Global uncaught errors
  window.addEventListener("error", (event) => {
    Sentry.captureException(event.error || event.message);
  });

  // Global unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    Sentry.captureException(event.reason);
  });
}

const container = document.getElementById("root");
if (container === null) {
  throw new Error("The #root element wasn't found");
}

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    <Provider>
      <Router basename="/maps">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            Sentry.captureException(error, { extra: { stack: info.componentStack } });
          }}
        >
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
