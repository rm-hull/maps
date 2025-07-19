import { useCallback, useMemo, useState } from "react";
import { Badge } from "@chakra-ui/react";
import { Feature } from "geojson";
import { GeoJSON } from "react-leaflet";
import { type LatLngBounds } from "leaflet";
import { Layer } from "leaflet";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { usePostcodePolygons } from "../../../hooks/usePostcodePolygons";

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

export default function PostcodePolygonsLayer({ bounds }: PostcodePolygonsLayerProps) {
  const { mousePosition, updateMousePosition } = useMousePosition();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string>();
  const { data, error } = usePostcodePolygons(bounds);
  useErrorToast("postcode-polygons-error", "Error loading postcode polygons", error);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: () => {
        setHoveredFeatureId(feature.id?.toString());
      },
      // mouseout: (e: LeafletMouseEvent) => {
      //   console.log(e);
      //   debouncedSetHoveredFeatureId(undefined);
      // },
    });
  }, []);

  const hoveredFeature = useMemo(() => {
    return data?.features.find((f) => f.id?.toString() === hoveredFeatureId);
  }, [hoveredFeatureId, data]);

  return (
    <>
      {data && <GeoJSON data={data} style={hiddenStyle} onEachFeature={onEachFeature} />}
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
      </Badge>
      {hoveredFeature && (
        <GeoJSON
          key={hoveredFeatureId}
          data={hoveredFeature}
          style={defaultStyle}
          pathOptions={{ lineJoin: "round", lineCap: "round" }}
          eventHandlers={{
            mousemove: (e) => {
              setTooltipVisible(true);
              updateMousePosition(e.originalEvent);
            },
            mouseout: () => {
              setTooltipVisible(false);
            },
          }}
        />
      )}
    </>
  );
}
