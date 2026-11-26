import * as L from "leaflet";

// Leaflet plugins expect a mutable global and add their APIs to it.
Reflect.set(globalThis, "L", { ...L });

await import("@luomus/leaflet-smooth-wheel-zoom");