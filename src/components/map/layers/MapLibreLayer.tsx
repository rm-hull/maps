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

type MLMap = L.Layer & {
  getMaplibreMap(): MaplibreMap;
  _currentProps?: MapLibreLayerProps;
};

/**
 * Type for storing original opacity values (can be numbers or MapLibre expressions)
 */
type OpacitySnapshot = Map<string, Record<string, any>>;

/**
 * WeakMap to store snapshots associated with layer instances to maintain type safety
 * and avoid progressive degradation bugs.
 */
const opacitySnapshots = new WeakMap<MLMap, OpacitySnapshot>();

/**
 * Track pending style load callbacks to avoid redundant listeners.
 */
const pendingStyleLoads = new WeakMap<MaplibreMap, Set<() => void>>();

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
    if (map.getLayer(layerId)) {
      for (const [prop, baseValue] of Object.entries(baseValues)) {
        // If opacity is 1, restore original value; otherwise, scale it.
        // We use a multiplication expression to preserve any original expressions
        // (e.g. zoom-based interpolation), but use simple multiplication for numbers.
        let finalValue = baseValue;
        if (opacity !== 1) {
          finalValue = typeof baseValue === "number" ? baseValue * opacity : ["*", baseValue, opacity];
        }
        map.setPaintProperty(layerId, prop, finalValue);
      }
    }
  }
}

function withStyleLoaded(map: MaplibreMap, fn: () => void): void {
  if (map.isStyleLoaded()) {
    fn();
  } else {
    let pending = pendingStyleLoads.get(map);
    if (!pending) {
      pending = new Set();
      pendingStyleLoads.set(map, pending);
      map.once("styledata", () => {
        const callbacks = pendingStyleLoads.get(map);
        if (callbacks) {
          pendingStyleLoads.delete(map);
          callbacks.forEach((cb) => cb());
        }
      });
    }
    pending.add(fn);
  }
}

export const MapLibreLayer = createLayerComponent<MLMap, MapLibreLayerProps>(
  (props, context) => {
    const { url, ...options } = props;
    const instance = L.maplibreGL({ style: url, ...options }) as unknown as MLMap;
    instance._currentProps = props;

    const setup = () => {
      const map = instance.getMaplibreMap();
      if (!map) return;

      withStyleLoaded(map, () => {
        const currentProps = instance._currentProps ?? props;
        // Only build snapshot if it doesn't exist to avoid progressive degradation
        let snapshot = opacitySnapshots.get(instance);
        if (!snapshot) {
          snapshot = buildOpacitySnapshot(map);
          opacitySnapshots.set(instance, snapshot);
        }
        applyOpacity(map, currentProps.opacity ?? 1, snapshot);
      });
    };

    instance.on("add", setup);

    return { instance, context };
  },

  (instance, props, prevProps) => {
    instance._currentProps = props;
    const map = instance.getMaplibreMap();
    if (!map) return;

    if (props.url !== prevProps.url) {
      map.setStyle(props.url);
      // Style has changed, so any existing snapshot is now stale
      opacitySnapshots.delete(instance);

      withStyleLoaded(map, () => {
        const currentProps = instance._currentProps ?? props;
        const snapshot = buildOpacitySnapshot(map);
        opacitySnapshots.set(instance, snapshot);
        applyOpacity(map, currentProps.opacity ?? 1, snapshot);
      });
    } else if (props.opacity !== prevProps.opacity) {
      withStyleLoaded(map, () => {
        const currentProps = instance._currentProps ?? props;
        let snapshot = opacitySnapshots.get(instance);
        if (!snapshot) {
          snapshot = buildOpacitySnapshot(map);
          opacitySnapshots.set(instance, snapshot);
        }
        applyOpacity(map, currentProps.opacity ?? 1, snapshot);
      });
    }
  }
);
