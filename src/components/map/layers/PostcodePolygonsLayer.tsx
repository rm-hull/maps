import { Feature, FeatureCollection } from "geojson";
import { GeoJSON } from "react-leaflet";
import { Layer } from "leaflet";
import { useCallback, useMemo, useState } from "react";
import data from "./hg2.json";

const defaultStyle = {
  color: "#0000FF77", // Default blue color
  weight: 2,
  // opacity: 0.4,
  fillColor: "#0000FF",
  fillOpacity: 0.1,
};

const hiddenStyle = {
  color: "#ff000055",
  weight: 1,
  // opacity: 0.7,
  // fillColor: "#ff0000",
  fillOpacity: 0.0,
};

export default function PostcodePolygonsLayer() {
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  // const [featurePopupContent, setFeaturePopupContent] = useState<string | null>(null);
  // const [popupLatLng, setPopupLatLng] = useState<LatLng | null>(null);

  const geoJsonData = useMemo(() => data as FeatureCollection, []);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: () => {
        setHoveredFeatureId(feature.properties?.postcode);
      },
    });
  }, []);

  const hoveredFeature = useMemo(() => {
    if (hoveredFeatureId !== null) {
      return geoJsonData.features.find((f) => f.properties?.postcode === hoveredFeatureId);
    }
    return null;
  }, [hoveredFeatureId, geoJsonData]);

  return (
    <>
      <GeoJSON data={geoJsonData} style={hiddenStyle} onEachFeature={onEachFeature} />
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
