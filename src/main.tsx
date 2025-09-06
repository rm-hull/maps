import "./index.css";
import "leaflet/dist/leaflet.css";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import ReactGA from "react-ga4";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import { ErrorFallback } from "./components/ErrorFallback";
import SettingsProvider from "./components/settings/SettingsProvider";
import { Provider } from "./components/ui/provider";
import { reportWebVitals } from "./reportWebVitals";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

if (import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID !== undefined) {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID as string);
}

const container = document.getElementById("root");
if (container === null) {
  throw new Error("The #root element wasn't found");
}

const root = createRoot(container);
// const manager = createLocalStorageManager("maps.color-mode");
const queryClient = new QueryClient();

root.render(
  <>
    {/* <ColorModeScript storageKey="maps.color-mode" /> */}
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Provider>
        <SettingsProvider>
          <Router basename="/maps">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <App />
            </ErrorBoundary>
          </Router>
        </SettingsProvider>
      </Provider>
    </QueryClientProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.debug);
