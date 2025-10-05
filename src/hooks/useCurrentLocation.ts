import { type LatLng } from "leaflet";
import { type MouseEvent, useCallback, useState } from "react";
import { useMapEvents } from "react-leaflet";

interface LocationDetails {
  position?: LatLng;
  accuracy?: number;
  timestamp?: number;
  active: boolean;
  pending: boolean;
  cancelTimerId?: NodeJS.Timeout;
  error?: Error;
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

  const map = useMapEvents({
    locationfound: (event) => {
      if (locationDetails.pending) {
        map.flyTo(event.latlng, map.getZoom());
      }

      setLocationDetails((prev) => ({
        ...prev,
        pending: false,
        position: event.latlng,
        accuracy: event.accuracy,
        timestamp: event.timestamp,
        error: undefined,
      }));
    },

    locationerror: (event) => {
      map.stopLocate();
      clearTimeout(locationDetails.cancelTimerId);

      setLocationDetails({
        active: false,
        pending: false,
        error: new Error(event.message),
        position: undefined,
        accuracy: undefined,
        timestamp: undefined,
      });
    },
  });

  const activate = useCallback((event?: MouseEvent<HTMLButtonElement>): void => {
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
  }, []);

  return { activate, location: locationDetails };
}
