import { useCallback, useMemo, useState } from "react";
import { Feature } from "geojson";
import { GeoJSON, useMap, useMapEvents } from "react-leaflet";
import { type LatLngBounds } from "leaflet";
import { Layer } from "leaflet";
// import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { usePostcodePolygons } from "../../../hooks/usePostcodePolygons";

const defaultStyle = {
  color: "#0000FF77",
  weight: 2,
  fillColor: "#0000FF",
  fillOpacity: 0.1,
};

const hiddenStyle = {
  color: "#ff000055",
  weight: 1,
  fillOpacity: 0.0,
};

export default function PostcodePolygonsLayer() {
  const map = useMap();
  // const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());

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

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
    },
    zoomend() {
      setBounds(map.getBounds());
    },
    // overlayadd(event) {
    //   handleOverlayChange(event.name, true);
    // },
    // overlayremove(event) {
    //   handleOverlayChange(event.name, false);
    // },
  });

  const hoveredFeature = useMemo(() => {
    return data?.features.find((f) => f.id?.toString() === hoveredFeatureId);
  }, [hoveredFeatureId, data]);

  console.log({ hoveredFeatureId, hoveredFeature });
  return (
    <>
      {data && <GeoJSON data={data} style={hiddenStyle} onEachFeature={onEachFeature} />}
      {hoveredFeature && (
        <GeoJSON
          key={hoveredFeatureId}
          data={hoveredFeature}
          style={defaultStyle}
          pathOptions={{ lineJoin: "round", lineCap: "round" }}
        />
      )}
      {/* {featurePopupContent && popupLatLng && <Popup position={popupLatLng}>{featurePopupContent}</Popup>} */}
    </>
  );
}
