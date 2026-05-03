import { createLayerComponent, LayerProps } from "@react-leaflet/core";
import * as L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import type { Map as MaplibreMap, StyleSpecification } from "maplibre-gl";
import { ReactNode } from "react";

interface MapLibreLayerProps extends L.LeafletMaplibreGLOptions, LayerProps {
  url: string;
  children?: ReactNode;
  pane?: string;
  zIndex?: number;
  opacity?: number;
}

type MLMap = L.Layer & { getMaplibreMap(): MaplibreMap };

const OPACITY_PROPERTIES: Partial<Record<string, string[]>> = {
  background: ["background-opacity"],
  circle: ["circle-opacity"],
  fill: ["fill-opacity"],
  "fill-extrusion": ["fill-extrusion-opacity"],
  haze: ["haze-opacity"],
  line: ["line-opacity"],
  raster: ["raster-opacity"],
  symbol: ["icon-opacity", "text-opacity"],
};

function buildOpacitySnapshot(map: MaplibreMap): Map<string, Record<string, number>> {
  const snapshot = new Map<string, Record<string, number>>();
  const style = map.getStyle() as StyleSpecification | undefined;
  if (!style?.layers) return snapshot;

  for (const layer of style.layers) {
    const props = OPACITY_PROPERTIES[layer.type];
    if (!props) continue;
    const values: Record<string, number> = {};
    for (const prop of props) {
      const val = map.getPaintProperty(layer.id, prop);
      // getPaintProperty returns undefined if unset — default is 1
      values[prop] = typeof val === "number" ? val : 1;
    }
    snapshot.set(layer.id, values);
  }

  return snapshot;
}

function applyOpacity(
  map: MaplibreMap,
  opacity: number,
  snapshot: Map<string, Record<string, number>>
): void {
  for (const [layerId, baseValues] of snapshot) {
    for (const [prop, baseOpacity] of Object.entries(baseValues)) {
      try {
        map.setPaintProperty(layerId, prop, baseOpacity * opacity);
      } catch {
        // layer may have been removed since snapshot was taken
      }
    }
  }
}

function withStyleLoaded(map: MaplibreMap, fn: () => void): void {
  if (map.isStyleLoaded()) {
    fn();
  } else {
    map.once("styledata", fn);
  }
}

export const MapLibreLayer = createLayerComponent<MLMap, MapLibreLayerProps>(
  (props, context) => {
    const { url, opacity, ...options } = props;
    const instance = L.maplibreGL({ style: url, ...options }) as unknown as MLMap;

    // Snapshot is captured once per style load and reused for updates
    let opacitySnapshot = new Map<string, Record<string, number>>();

    if (opacity !== undefined) {
      instance.on("add", () => {
        const map = instance.getMaplibreMap();
        withStyleLoaded(map, () => {
          opacitySnapshot = buildOpacitySnapshot(map);
          applyOpacity(map, opacity, opacitySnapshot);
        });
      });
    }

    // Expose snapshot on instance so the update function can reach it
    (instance as any).__opacitySnapshot = () => opacitySnapshot;

    return { instance, context };
  },

  (instance, props, prevProps) => {
    const map = instance.getMaplibreMap();
    if (!map) return;

    if (props.url !== prevProps.url) {
      map.setStyle(props.url);
      // Snapshot is stale after a style change — rebuild on next styledata
      // The "add" listener won't re-fire, so we re-register here
      if (props.opacity !== undefined) {
        map.once("styledata", () => {
          const snapshot = buildOpacitySnapshot(map);
          (instance as any).__opacitySnapshot = () => snapshot;
          applyOpacity(map, props.opacity!, snapshot);
        });
      }
    }

    if (props.opacity !== prevProps.opacity && props.opacity !== undefined) {
      const snapshot: Map<string, Record<string, number>> =
        (instance as any).__opacitySnapshot?.() ?? new Map();
      withStyleLoaded(map, () => applyOpacity(map, props.opacity!, snapshot));
    }
  },
);