import * as L from "leaflet";
import "leaflet-measure";
import "leaflet-measure/dist/leaflet-measure.css";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

// @ts-expect-error: L.Control type does not have a Measure property
const measureControl = new L.Control.Measure({
  position: "topleft",
  primaryLengthUnit: "meters",
  secondaryLengthUnit: "miles",
  primaryAreaUnit: "sqmeters",
  secondaryAreaUnit: "acres",
});

// @ts-expect-error: L.Control type does not have a Measure property
L.Control.Measure.include({
  _setCaptureMarkerIcon: function () {
    this._captureMarker.options.autoPanOnFocus = false;
    this._captureMarker.setIcon(L.divIcon({ iconSize: this._map.getSize().multiplyBy(2) }));
  },
});

export function Ruler() {
  const map = useMap();

  useEffect(() => {
    map.removeControl(measureControl);
    map.addControl(measureControl);
  }, [map]);

  return null;
}
