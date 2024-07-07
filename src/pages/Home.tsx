import { type JSX } from "react";
import OSMap from "../components/map/OSMap";
import useSettings from "../hooks/useSettings";
import { lazily } from "react-lazily";
import { Loader } from "../components/Loader";
import { LatLngTuple } from "leaflet";

const { SettingsModal } = lazily(async () => await import("../components/settings/SettingsModal"));

type HomeProps = {
  latLng?: LatLngTuple;
};

export default function Home({ latLng }: HomeProps): JSX.Element {
  const { isOpen, onClose } = useSettings();
  return (
    <>
      <OSMap center={latLng}/>
      {isOpen && (
        <Loader>
          <SettingsModal isOpen={isOpen} onClose={onClose} />
        </Loader>
      )}
    </>
  );
}
