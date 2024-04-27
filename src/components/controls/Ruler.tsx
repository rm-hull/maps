/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet-measure";
import "leaflet-measure/dist/leaflet-measure.css";
import { useEffect } from "react";

// @ts-expect-error
const measureControl = new L.Control.Measure({
  position: "topleft",
  primaryLengthUnit: "meters",
  secondaryLengthUnit: "miles",
  primaryAreaUnit: "sqmeters",
  secondaryAreaUnit: "acres",
});

// @ts-expect-error
L.Control.Measure.include({
  _setCaptureMarkerIcon: function () {
    this._captureMarker.options.autoPanOnFocus = false;
    this._captureMarker.setIcon(L.divIcon({ iconSize: this._map.getSize().multiplyBy(2) }));
  },
});

export default function Ruler() {
  const map = useMap();

  useEffect(() => {
    map.removeControl(measureControl);
    map.addControl(measureControl);
  }, [map]);

  return null;
}
