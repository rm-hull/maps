import { type LatLngTuple } from "leaflet";
import { Loader } from "../components/Loader";
import { OSMap } from "../components/map/OSMap";
import { lazily } from "react-lazily";
import { useSettings } from "../hooks/useSettings";

const { SettingsModal } = lazily(() => import("../components/settings/SettingsModal"));

interface HomeProps {
  latLng?: LatLngTuple;
}

export function Home({ latLng }: HomeProps) {
  const { isOpen, onClose } = useSettings();
  return (
    <>
      <OSMap center={latLng} />
      {isOpen && (
        <Loader>
          <SettingsModal isOpen={isOpen} onClose={onClose} />
        </Loader>
      )}
    </>
  );
}
