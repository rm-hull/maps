import { type LatLng } from "leaflet";
import { type MouseEvent, useCallback, useRef, useState } from "react";
import { useMapEvents } from "react-leaflet";

interface LocationDetails {
  position?: LatLng;
  accuracy?: number;
  timestamp?: number;
  active: boolean;
  pending: boolean;
  error?: Error;
}

interface UseCurrentLocationReturnType {
  activate: (event?: MouseEvent<HTMLButtonElement>) => void;
  location: LocationDetails;
}

export function useCurrentLocation(
  duration: number = 180_000,
): UseCurrentLocationReturnType {
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    active: false,
    pending: true,
  });

  const cancelTimerIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
      if (cancelTimerIdRef.current) {
        clearTimeout(cancelTimerIdRef.current);
      }

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

  const activate = useCallback(
    (event?: MouseEvent<HTMLButtonElement>): void => {
      event?.stopPropagation();
      event?.preventDefault();

      map.locate({ enableHighAccuracy: true, watch: true });

      if (cancelTimerIdRef.current) {
        clearTimeout(cancelTimerIdRef.current);
      }
      const timerId = setTimeout(() => {
        map.stopLocate();
        setLocationDetails((prev) => ({ ...prev, active: false }));
      }, duration);
      cancelTimerIdRef.current = timerId;

      setLocationDetails((prev) => ({
        ...prev,
        pending: true,
        active: true,
      }));
    },
    [duration, map],
  );

  return { activate, location: locationDetails };
}
