import { type LatLng } from "leaflet";
import { useState, type MouseEvent } from "react";
import { useMapEvent } from "react-leaflet";

interface LocationDetails {
  position?: LatLng;
  accuracy?: number;
  timestamp?: number;
  active: boolean;
  pending: boolean;
  cancelTimerId?: NodeJS.Timeout;
}

interface UseCurrentLocationReturnType {
  activate: (event?: MouseEvent<HTMLButtonElement>) => void;
  location: LocationDetails;
}

export function useCurrentLocation(duration: number = 180_000): UseCurrentLocationReturnType {
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    active: false,
    pending: true,
  });
  const map = useMapEvent("locationfound", (event) => {
    if (locationDetails.pending) {
      map.flyTo(event.latlng, map.getZoom());
    }

    setLocationDetails((prev) => ({
      ...prev,
      pending: false,
      position: event.latlng,
      accuracy: event.accuracy,
      timestamp: event.timestamp,
    }));
  });

  const activate = (event?: MouseEvent<HTMLButtonElement>): void => {
    event?.stopPropagation();
    event?.preventDefault();

    map.locate({ enableHighAccuracy: true, watch: true });

    clearTimeout(locationDetails.cancelTimerId);
    const timerId = setTimeout(() => {
      map.stopLocate();
      setLocationDetails((prev) => ({ ...prev, active: false }));
    }, duration);

    setLocationDetails((prev) => ({
      ...prev,
      pending: true,
      active: true,
      cancelTimerId: timerId,
    }));
  };

  return { activate, location: locationDetails };
}
