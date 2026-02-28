import { useEffect } from "react";
import { useMap } from "react-leaflet";
import AutoGraticule from "leaflet-auto-graticule";
import './GridlinesLayer.css';

export function GridlinesLayer() {
  const map = useMap();

  useEffect(() => {
    const graticule = new AutoGraticule({
      redraw: "move",
    });

    graticule.lineStyle = {
      color: "red",
      weight: 1,
      opacity: 0.75,
      dashArray: "5 5",
      noClip: true,
    };

    graticule.addTo(map);

    return () => {
      map.removeLayer(graticule)
    };
  }, [map]);

  return null;
}