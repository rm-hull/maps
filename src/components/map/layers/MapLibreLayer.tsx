import { createLayerComponent, LayerProps } from "@react-leaflet/core";
import * as L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import { ReactNode } from "react";

interface MapLibreLayerProps extends L.LeafletMaplibreGLOptions, LayerProps {
  url: string;
  children?: ReactNode;
  pane?: string;
  zIndex?: number;
  opacity?: number;
}

export const MapLibreLayer = createLayerComponent<L.Layer & { getMaplibreMap(): any }, MapLibreLayerProps>(
  (props, context) => {
    const { url, opacity, ...options } = props;
    const instance = L.maplibreGL({ style: url, ...options }) as unknown as L.Layer & {
      getMaplibreMap(): any;
    };

    if (opacity !== undefined) {
      const applyOpacity = () => {
        const map = instance.getMaplibreMap();
        if (!map) return;

        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.opacity = opacity.toString();
        }

        const style = map.getStyle();
        if (style && style.layers) {
          style.layers.forEach((layer: any) => {
            try {
              if (layer.type === "line") {
                map.setPaintProperty(layer.id, "line-opacity", opacity);
              } else if (layer.type === "fill") {
                map.setPaintProperty(layer.id, "fill-opacity", opacity);
              } else if (layer.type === "symbol") {
                map.setPaintProperty(layer.id, "icon-opacity", opacity);
                map.setPaintProperty(layer.id, "text-opacity", opacity);
              }
            } catch (e) {
              // Ignore layers that don't support the property
            }
          });
        }
      };

      instance.on("add", () => {
        const map = instance.getMaplibreMap();
        if (map.isStyleLoaded()) {
          applyOpacity();
        } else {
          map.once("idle", applyOpacity);
        }
      });
    }

    return { instance, context };
  },
  (instance, props, prevProps) => {
    if (props.url !== prevProps.url) {
      instance.getMaplibreMap()?.setStyle(props.url);
    }
    if (props.opacity !== prevProps.opacity && props.opacity !== undefined) {
      const map = instance.getMaplibreMap();
      if (!map) return;

      const applyOpacity = () => {
        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.opacity = props.opacity!.toString();
        }

        const style = map.getStyle();
        if (style && style.layers) {
          style.layers.forEach((layer: any) => {
            try {
              if (layer.type === "line") {
                map.setPaintProperty(layer.id, "line-opacity", props.opacity);
              } else if (layer.type === "fill") {
                map.setPaintProperty(layer.id, "fill-opacity", props.opacity);
              } else if (layer.type === "symbol") {
                map.setPaintProperty(layer.id, "icon-opacity", props.opacity);
                map.setPaintProperty(layer.id, "text-opacity", props.opacity);
              }
            } catch (e) {
              // Ignore layers that don't support the property
            }
          });
        }
      };

      if (map.isStyleLoaded()) {
        applyOpacity();
      } else {
        map.once("idle", applyOpacity);
      }
    }
  }
);
