import { ChakraProvider, ColorModeScript, createLocalStorageManager, theme } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import ErrorFallback from "./components/ErrorFallback";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
if (!container) {
  throw new Error("The #root element wasn't found");
}

const root = createRoot(container);
const manager = createLocalStorageManager("maps.color-mode");
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <ColorModeScript storageKey="maps.color-mode" />
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider theme={theme} colorModeManager={manager}>
        <Router basename="/maps">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <App />
          </ErrorBoundary>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();