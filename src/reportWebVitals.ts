import { Metric } from "web-vitals";

export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onINP(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
        return null;
      })
      .catch(console.error);
  }
};
