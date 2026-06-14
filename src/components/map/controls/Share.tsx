import { type LatLngTuple } from "leaflet";
import { IoMdShare } from "react-icons/io";
import { useMap } from "react-leaflet";
import { ControlButton } from "@/components/ControlButton";
import { toaster } from "@/components/ui/toaster";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { encodeState } from "@/utils/share";
import { Control } from "../Control";

interface ShareProps {
  mapStyle: string;
}

export function Share({ mapStyle }: ShareProps) {
  const map = useMap();
  const { settings } = useGeneralSettings();

  const handleShare = async () => {
    const center = map.getCenter();
    const state = {
      center: [center.lat, center.lng] as LatLngTuple,
      zoom: map.getZoom(),
      settings: {
        mapStyle: mapStyle,
        overlays: settings?.overlays,
      },
      popup: (map as any)._popup ? (map as any)._popup.getLatLng() : undefined,
    };

    const encoded = encodeState(state);
    const url = new URL(window.location.href);
    url.searchParams.set("s", encoded);

    try {
      await navigator.clipboard.writeText(url.toString());
      toaster.create({
        id: "share-toast",
        title: "Link copied!",
        description: "The current map state has been copied to your clipboard.",
        type: "success",
        duration: 9000,
        closable: true,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Control position="topright">
      <ControlButton onClick={handleShare}>
        <IoMdShare />
      </ControlButton>
    </Control>
  );
}
