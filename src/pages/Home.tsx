import { type LatLngTuple } from "leaflet";
import { type JSX } from "react";
import { lazily } from "react-lazily";
import { Loader } from "../components/Loader";
import { OSMap } from "../components/map/OSMap";
import { useSettings } from "../hooks/useSettings";

const { SettingsModal } = lazily(async () => await import("../components/settings/SettingsModal"));

interface HomeProps {
  latLng?: LatLngTuple;
}

export function Home({ latLng }: HomeProps): JSX.Element {
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
