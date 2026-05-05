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

/**
 * Type for storing original opacity values (can be numbers or MapLibre expressions)
 */
type OpacitySnapshot = Map<string, Record<string, any>>;

/**
 * WeakMap to store snapshots associated with layer instances to maintain type safety
 * and avoid progressive degradation bugs.
 */
const opacitySnapshots = new WeakMap<MLMap, OpacitySnapshot>();

const OPACITY_PROPERTIES: Partial<Record<string, string[]>> = {
  background: ["background-opacity"],
  circle: ["circle-opacity"],
  fill: ["fill-opacity"],
  "fill-extrusion": ["fill-extrusion-opacity"],
  heatmap: ["heatmap-opacity"],
  line: ["line-opacity"],
  raster: ["raster-opacity"],
  symbol: ["icon-opacity", "text-opacity"],
};

export function buildOpacitySnapshot(map: MaplibreMap): OpacitySnapshot {
  const snapshot: OpacitySnapshot = new Map();
  const style = map.getStyle() as StyleSpecification | undefined;
  if (!style?.layers) return snapshot;

  for (const layer of style.layers) {
    const props = OPACITY_PROPERTIES[layer.type];
    if (!props) continue;
    const values: Record<string, any> = {};
    for (const prop of props) {
      const val = map.getPaintProperty(layer.id, prop);
      // getPaintProperty returns undefined if unset — default is 1
      values[prop] = val ?? 1;
    }
    snapshot.set(layer.id, values);
  }

  return snapshot;
}

export function applyOpacity(map: MaplibreMap, opacity: number, snapshot: OpacitySnapshot): void {
  for (const [layerId, baseValues] of snapshot) {
    for (const [prop, baseValue] of Object.entries(baseValues)) {
      for (const [prop, baseValue] of Object.entries(baseValues)) {
        if (map.getLayer(layerId)) {
          // If opacity is 1, restore original value; otherwise, multiply using an expression
          // to preserve any original expressions (e.g. zoom-based interpolation)
          const finalValue = opacity === 1 ? baseValue : ["*", baseValue, opacity];
          map.setPaintProperty(layerId, prop, finalValue);
        }
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

    instance.on("add", () => {
      const map = instance.getMaplibreMap();
      withStyleLoaded(map, () => {
        // Only build snapshot if it doesn't exist to avoid progressive degradation
        let snapshot = opacitySnapshots.get(instance);
        if (!snapshot) {
          snapshot = buildOpacitySnapshot(map);
          opacitySnapshots.set(instance, snapshot);
        }
        if (opacity !== undefined) {
          applyOpacity(map, opacity, snapshot);
        }
      });
    });

    return { instance, context };
  },

  (instance, props, prevProps) => {
    const map = instance.getMaplibreMap();
    if (!map) return;

    if (props.url !== prevProps.url) {
      map.setStyle(props.url);
      // Style has changed, so any existing snapshot is now stale
      opacitySnapshots.delete(instance);

      map.once("styledata", () => {
        const snapshot = buildOpacitySnapshot(map);
        opacitySnapshots.set(instance, snapshot);
        applyOpacity(map, props.opacity ?? 1, snapshot);
      });
    } else if (props.opacity !== prevProps.opacity) {
      withStyleLoaded(map, () => {
        let snapshot = opacitySnapshots.get(instance);
        if (!snapshot) {
          snapshot = buildOpacitySnapshot(map);
          opacitySnapshots.set(instance, snapshot);
        }
        applyOpacity(map, props.opacity ?? 1, snapshot);
      });
    }
  }
);
