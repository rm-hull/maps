import { Badge } from "@chakra-ui/react";
import { Feature } from "geojson";
import { type LatLngBounds } from "leaflet";
import { Layer } from "leaflet";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { GeoJSON, useMap } from "react-leaflet";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useMousePosition } from "../../../../hooks/useMousePosition";
import { usePostcodePolygons } from "../../../../hooks/usePostcodePolygons";

const defaultStyle = {
  color: "#0000FF77",
  weight: 2,
  fillColor: "#0000FF",
  fillOpacity: 0.1,
};

const hiddenStyle = {
  // color: "#ff000055",
  color: "#ff000000",
  weight: 1,
  fillOpacity: 0.0,
};

interface PostcodePolygonsLayerProps {
  bounds: LatLngBounds;
}

export function PostcodePolygonsLayer({ bounds }: PostcodePolygonsLayerProps) {
  const map = useMap();
  const { mousePosition, updateMousePosition } = useMousePosition();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string>();
  const { data, error } = usePostcodePolygons(bounds);
  useErrorToast("postcode-polygons-error", "Error loading postcode polygons", error);

  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      layer.on({
        mouseover: (e) => {
          setHoveredFeatureId(feature.id?.toString());
          setTooltipVisible(true);
          updateMousePosition(e.originalEvent);
        },
        mousemove: (e) => {
          setTooltipVisible(true);
          updateMousePosition(e.originalEvent);
        },
        mouseout: () => {
          setTooltipVisible(false);
          setHoveredFeatureId(undefined);
        },
      });
    },
    [updateMousePosition]
  );

  const styleFn = useCallback(
    (feature: Feature | undefined) => {
      if (feature && feature.id?.toString() === hoveredFeatureId) {
        return defaultStyle;
      }
      return hiddenStyle;
    },
    [hoveredFeatureId]
  );

  return (
    <>
      {data && (
        <GeoJSON
          data={data}
          style={styleFn}
          onEachFeature={onEachFeature}
          pathOptions={{ lineJoin: "round", lineCap: "round" }}
        />
      )}

      {createPortal(
        <Badge
          visibility={tooltipVisible ? "visible" : "hidden"}
          colorScheme="blue"
          pointerEvents="none"
          position="absolute"
          zIndex={400}
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 30}px`,
          }}
        >
          {hoveredFeatureId}
        </Badge>,
        map.getContainer()
      )}
    </>
  );
}
