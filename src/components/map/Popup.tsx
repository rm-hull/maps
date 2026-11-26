import { Popup as LeafletPopup, type PopupProps } from "react-leaflet";
import { useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { decodeState } from "@/utils/share";

export const Popup = forwardRef<any, PopupProps>((props, ref) => {
  const map = useMap();
  const internalRef = useRef<any>(null);
  const [searchParams] = useSearchParams();
  const sharedStateEncoded = searchParams.get("s");
  const popupLocation = useMemo(
    () => (sharedStateEncoded ? decodeState(sharedStateEncoded)?.popup : undefined),
    [sharedStateEncoded]
  );

  useImperativeHandle(ref, () => internalRef.current);

  useEffect(() => {
    if (!popupLocation) return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = 500;

    const attemptOpen = () => {
      if (internalRef.current) {
        const latLng = internalRef.current.getLatLng();
        if (
          latLng &&
          Math.abs(latLng.lat - popupLocation[0]) < 0.001 &&
          Math.abs(latLng.lng - popupLocation[1]) < 0.001
        ) {
          internalRef.current.openOn(map);
          return true;
        }
      }
      return false;
    };
    const timer = setInterval(() => {
      attempts++;
      if (attemptOpen() || attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, interval);

    if (attemptOpen()) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [popupLocation, map]);

  return <LeafletPopup {...props} ref={internalRef} />;
});
