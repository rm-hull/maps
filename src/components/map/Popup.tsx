import { Popup as LeafletPopup, type PopupProps } from "react-leaflet";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useMap } from "react-leaflet";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";

export const Popup = forwardRef<any, PopupProps>((props, ref) => {
  const map = useMap();
  const internalRef = useRef<any>(null);
  const { settings } = useGeneralSettings();

  useImperativeHandle(ref, () => internalRef.current);

  useEffect(() => {
    const activePopupLocation = settings?.activePopupLocation;
    if (!activePopupLocation) return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = 500;

    const attemptOpen = () => {
      if (internalRef.current) {
        const latLng = internalRef.current.getLatLng();
        if (latLng && Math.abs(latLng.lat - activePopupLocation[0]) < 0.001 &&
            Math.abs(latLng.lng - activePopupLocation[1]) < 0.001) {
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
  }, [settings?.activePopupLocation, map]);

  return <LeafletPopup {...props} ref={internalRef} />;
});
